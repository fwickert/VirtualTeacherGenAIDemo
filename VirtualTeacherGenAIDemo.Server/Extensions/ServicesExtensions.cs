using Microsoft.Extensions.Options;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Services;
using VirtualTeacherGenAIDemo.Server.Storage;
using System.Reflection;

namespace VirtualTeacherGenAIDemo.Server.Extensions
{
    public static class ServicesExtensions
    {
        public static IServiceCollection AddOptions(this IServiceCollection services, ConfigurationManager configuration)
        {

            // General configuration
            AddOptions<ServiceOptions>(ServiceOptions.PropertyName);

            AddOptions<CosmosOptions>(CosmosOptions.PropertyName);

            // Default AI service configurations for Semantic Kernel
            AddOptions<AIServiceOptions>(AIServiceOptions.PropertyName);

            AddOptions<AssistantOption>(AssistantOption.PropertyName);

            AddOptions<SpeechOptions>(SpeechOptions.PropertyName);

            return services;

            void AddOptions<TOptions>(string propertyName)
                where TOptions : class
            {
                services.AddOptions<TOptions>(configuration.GetSection(propertyName));
            }
        }

        internal static void AddOptions<TOptions>(this IServiceCollection services, IConfigurationSection section)
           where TOptions : class
        {
            services.AddOptions<TOptions>()
                .Bind(section)
                .ValidateDataAnnotations()
                .ValidateOnStart()
                .PostConfigure(TrimStringProperties);
        }

        /// <summary>
        /// Add CORS settings.
        /// </summary>
        internal static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            IConfiguration configuration = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
            string[] allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            if (allowedOrigins.Length > 0)
            {
                services.AddCors(options =>
                {
                    options.AddDefaultPolicy(
                        policy =>
                        {
                            policy.WithOrigins(allowedOrigins)
                                .WithMethods("GET", "POST", "DELETE")
                                .AllowAnyHeader()
                                .AllowCredentials();                                
                        });
                });
            }

            return services;
        }

        internal static IServiceCollection AddStorageContext(this IServiceCollection services)
        {
            IStorageContext<MessageItem> messageStorageContext;
            CosmosOptions cosmosConfig = services.BuildServiceProvider().GetRequiredService<IOptions<CosmosOptions>>().Value;
            messageStorageContext = new CosmosDbContext<MessageItem>(cosmosConfig.EndPoint, cosmosConfig.Database, cosmosConfig.MessageContainer);
            services.AddSingleton<MessageRepository>(new MessageRepository(messageStorageContext));

            IStorageContext<SessionItem> sessionStorageContext; 
            sessionStorageContext = new CosmosDbContext<SessionItem>(cosmosConfig.EndPoint, cosmosConfig.Database, cosmosConfig.SessionContainer);
            services.AddSingleton<SessionRepository>(new SessionRepository(sessionStorageContext));            
            
            IStorageContext<DashboardItem> dashboardStorageContext;
            dashboardStorageContext = new CosmosDbContext<DashboardItem>(cosmosConfig.EndPoint, cosmosConfig.Database, cosmosConfig.DashboardContainer);
            services.AddSingleton<DashboardRepository>(new DashboardRepository(dashboardStorageContext));

            IStorageContext<AgentItem> agentStorageContext;
            agentStorageContext = new CosmosDbContext<AgentItem>(cosmosConfig.EndPoint, cosmosConfig.Database, cosmosConfig.AgentContainer);
            services.AddSingleton<AgentRepository>(new AgentRepository(agentStorageContext));

            IStorageContext<ScenarioItem> scenarioStorageContext;
            scenarioStorageContext = new CosmosDbContext<ScenarioItem>(cosmosConfig.EndPoint, cosmosConfig.Database, cosmosConfig.ScenarioContainer);
            services.AddSingleton<ScenarioRepository>(new ScenarioRepository(scenarioStorageContext));

            IStorageContext<UserItem> userStorageContext;
            userStorageContext = new CosmosDbContext<UserItem>(cosmosConfig.EndPoint, cosmosConfig.Database, cosmosConfig.UserContainer);
            services.AddSingleton<UserRepository>(new UserRepository(userStorageContext));


            return services;

        }   

        internal static IServiceCollection AddAIResponses(this IServiceCollection services)
        {
            services.AddScoped<LLMResponse>();
            services.AddScoped<ChatResponse>();

            return services;
        }

        /// <summary>
        /// Trim all string properties, recursively.
        /// </summary>
        private static void TrimStringProperties<T>(T options) where T : class
        {
            Queue<object> targets = new();
            targets.Enqueue(options);

            while (targets.Count > 0)
            {
                object target = targets.Dequeue();
                Type targetType = target.GetType();
                foreach (PropertyInfo property in targetType.GetProperties())
                {
                    // Skip enumerations
                    if (property.PropertyType.IsEnum)
                    {
                        continue;
                    }

                    // Property is a built-in type, readable, and writable.
                    if (property.PropertyType.Namespace == "System" &&
                        property.CanRead &&
                        property.CanWrite)
                    {
                        // Property is a non-null string.
                        if (property.PropertyType == typeof(string) &&
                            property.GetValue(target) != null)
                        {
                            property.SetValue(target, property.GetValue(target)!.ToString()!.Trim());
                        }
                    }
                    else
                    {
                        // Property is a non-built-in and non-enum type - queue it for processing.
                        if (property.GetValue(target) != null)
                        {
                            targets.Enqueue(property.GetValue(target)!);
                        }
                    }
                }
            }
        }


        internal static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<ChatService>();
            services.AddScoped<DashboardService>();
            services.AddScoped<CoachService>();
            services.AddScoped<AgentService>();
            services.AddScoped<ScenarioService>();
            services.AddScoped<SessionService>();
            services.AddScoped<UserService>();
            return services;
        }
    }
}
