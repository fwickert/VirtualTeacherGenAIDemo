using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using VirtualTeacherGenAIDemo.Server.AI;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Services;
using VirtualTeacherGenAIDemo.Server.Tools;

namespace VirtualTeacherGenAIDemo.Server.Extensions
{
    internal static class SemanticKernelExtensions
    {
        /// <summary>
        /// Delegate to register plugins with a Semantic Kernel
        /// </summary>
        public delegate Task RegisterPluginsWithKernel(IServiceProvider sp, Kernel kernel);

        /// <summary>
        /// Add Semantic Kernel services
        /// </summary>
        internal static IServiceCollection AddSemanticKernelServices(this IServiceCollection services, string serviceID = "default")
        {

            // Semantic Kernel
            services.AddScoped<Kernel>(sp =>
            {
                IKernelBuilder builder = Kernel.CreateBuilder();
                builder.Services.AddLogging(c => c.AddConsole().SetMinimumLevel(LogLevel.Information));
                builder.WithCompletionBackend(sp.GetRequiredService<IOptions<AIServiceOptions>>().Value, serviceID);
                builder.Services.AddHttpClient();


                var searchTool = new SearchTool(sp.GetRequiredService<SearchService>());
                builder.Plugins.AddFromObject(searchTool);


                Kernel kernel = builder.Build();
                sp.GetRequiredService<RegisterPluginsWithKernel>()(sp, kernel);
                return kernel;
            });

            // Register Plugins
            services.AddScoped<RegisterPluginsWithKernel>(sp => RegisterPluginsAsync);

            return services;

        }

        /// <summary>
        /// Add Chat Completion service
        /// </summary>
        internal static IServiceCollection AddChatCompletionService(this IServiceCollection services)
        {
            services.AddScoped<AzureOpenAIChatCompletionService>(sp =>
            {
                Kernel kernel = sp.GetRequiredService<Kernel>();
                var options = sp.GetRequiredService<IOptions<AIServiceOptions>>().Value;
                return new AzureOpenAIChatCompletionService(options.Models.ChatDeploymentName, options.Endpoint,options.Key);
            });

            return services;
        }


        internal static void AddKernelMemoryService(this WebApplicationBuilder appBuilder)
        {
            var servicesProvider = appBuilder.Services.BuildServiceProvider();
            var options = servicesProvider.GetRequiredService<IOptions<KernelMemoryOptions>>().Value;


            var azureOpenAIEmbeddingConfig = new AzureOpenAIConfig
            {
                Auth = options.Services.AzureOpenAIEmbedding.Auth,
                Endpoint = options.Services.AzureOpenAIEmbedding.Endpoint,
                APIKey = options.Services.AzureOpenAIEmbedding.APIKey,
                Deployment = options.Services.AzureOpenAIEmbedding.Deployment,
                MaxTokenTotal = options.Services.AzureOpenAIEmbedding.MaxTokenTotal,
                EmbeddingDimensions = options.Services.AzureOpenAIEmbedding.EmbeddingDimensions,
                MaxEmbeddingBatchSize = options.Services.AzureOpenAIEmbedding.MaxEmbeddingBatchSize,
                MaxRetries = options.Services.AzureOpenAIEmbedding.MaxRetries
            };

            var azureOpenAITextConfig = new AzureOpenAIConfig
            {
                Auth = options.Services.AzureOpenAIText.Auth,
                Endpoint = options.Services.AzureOpenAIText.Endpoint,
                APIKey = options.Services.AzureOpenAIText.APIKey,
                Deployment = options.Services.AzureOpenAIText.Deployment,
                MaxTokenTotal = options.Services.AzureOpenAIText.MaxTokenTotal,
                APIType = options.Services.AzureOpenAIText.APIType,
                MaxRetries = options.Services.AzureOpenAIText.MaxRetries
            };

            var azureAISearchConfig = new AzureAISearchConfig
            {
                Auth = options.Services.AzureAISearch.Auth,
                Endpoint = options.Services.AzureAISearch.Endpoint,
                APIKey = options.Services.AzureAISearch.APIKey,
                UseHybridSearch = options.Services.AzureAISearch.UseHybridSearch,
                UseStickySessions = options.Services.AzureAISearch.UseStickySessions
            };

            //azureAISearchConfig.UseHybridSearch = true;

            var builder = new KernelMemoryBuilder(appBuilder.Services)

                .WithAzureOpenAITextEmbeddingGeneration(azureOpenAIEmbeddingConfig)
                .WithAzureOpenAITextGeneration(azureOpenAITextConfig)
                .WithAzureAISearchMemoryDb(azureAISearchConfig)
                .WithSearchClientConfig(new SearchClientConfig { MaxMatchesCount = 5, Temperature = 0, TopP = 0 })
                .WithCustomImageOcr(new DocIntOCREngine()); ;



            builder.Services.AddSingleton<IKernelMemory>(builder.Build());


        }


        /// <summary>
        /// Register the plugins with the kernel.
        /// </summary>
        private static Task RegisterPluginsAsync(IServiceProvider sp, Kernel kernel)
        {
            // Semantic Plugins
            ServiceOptions options = sp.GetRequiredService<IOptions<ServiceOptions>>().Value;
            if (!string.IsNullOrWhiteSpace(options.SemanticPluginsDirectory))
            {
                foreach (string pluginDir in Directory.GetDirectories(options.SemanticPluginsDirectory))
                {
                    try
                    {
                        kernel.ImportPluginFromPromptDirectory(pluginDir);
                    }
                    catch (KernelException e)
                    {
                        var logger = kernel.LoggerFactory.CreateLogger(nameof(Kernel));
                        logger.LogError("Could not load skill from {Directory}: {Message}", pluginDir, e.Message);
                    }


                }
            }

            return Task.CompletedTask;
        }

        ///<summary>
        /// Add the completion backend to the kernel config.
        /// </summary>
        private static IKernelBuilder WithCompletionBackend(this IKernelBuilder kernelBuilder, AIServiceOptions options, string serviceID)
        {
            if (serviceID == "Default")
            {
                return options.Type switch
                {
                    AIServiceOptions.AIServiceType.AzureOpenAI
                        => kernelBuilder.AddAzureOpenAIChatCompletion(
                            deploymentName: options.Models.ChatDeploymentName,
                            endpoint: options.Endpoint,
                            serviceId: "AzureOpenAIChat",
                            apiKey: options.Key),
                    AIServiceOptions.AIServiceType.OpenAI
                        => kernelBuilder.AddOpenAIChatCompletion(options.Models.ChatDeploymentName, options.Key),
                    _
                        => throw new ArgumentException($"Invalid {nameof(options.Type)} value in '{AIServiceOptions.PropertyName}' settings."),
                };
            }
            else
            {
                //Replace by other DC
                return options.Type switch
                {
                    AIServiceOptions.AIServiceType.AzureOpenAI
                        => kernelBuilder.AddAzureOpenAIChatCompletion(
                            deploymentName: options.Models.ChatDeploymentName,
                            endpoint: options.Endpoint,
                            serviceId: "AzureOpenAIChat",
                            apiKey: options.Key),
                    AIServiceOptions.AIServiceType.OpenAI
                        => kernelBuilder.AddOpenAIChatCompletion(options.Models.ChatDeploymentName, options.Key),
                    _
                        => throw new ArgumentException($"Invalid {nameof(options.Type)} value in '{AIServiceOptions.PropertyName}' settings."),
                };
            }
        }
    }
}
