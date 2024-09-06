using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using VirtualTeacherGenAIDemo.Server.Options;

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
