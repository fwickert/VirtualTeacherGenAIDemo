using System.ComponentModel.DataAnnotations;

namespace VirtualTeacherGenAIDemo.Server.Options
{
    public sealed class AIServiceOptions
    {

        public const string PropertyName = "AIService";

        /// <summary>
        /// Supported Types of AI services.
        /// </summary>  
        public enum AIServiceType
        {
            /// <summary>
            /// Azure OpenAI
            /// </summary>  
            AzureOpenAI,

            /// <summary>
            /// OPENAI
            /// </summary>  
            OpenAI
        }

        /// <summary>
        /// AI Mode to use
        /// </summary>  
        public class ModelTypes
        {
            /// <summary>
            /// Azure OpenAI deployment name or OpenAI model name to use for completions
            /// </summary>   
            [Required, NotEmptyOrWhitespace]
            public string ChatDeploymentName { get; set; } = string.Empty;


            /// <summary>
            /// Azure OpenAI deployment name or OpenAI model name to use for embeddings.
            /// </summary>
            [Required, NotEmptyOrWhitespace]
            public string Embedding { get; set; } = string.Empty;

            /// <summary>
            /// Azure OpenAI deployment name or OpenAI model name to use for planner.
            /// </summary>
            [Required, NotEmptyOrWhitespace]
            public string Planner { get; set; } = string.Empty;
        }

        /// <summary>
        /// Type of AI service.
        /// </summary>
        [Required]
        public AIServiceType Type { get; set; } = AIServiceType.AzureOpenAI;

        /// <summary>
        /// Models/deployment names to use.
        /// </summary>
        [Required]
        public ModelTypes Models { get; set; } = new ModelTypes();

        /// <summary>
        /// (Azure OpenAI only) Azure OpenAI endpoint.
        /// </summary>
        [RequiredOnPropertyValue(nameof(Type), AIServiceType.AzureOpenAI, notEmptyOrWhitespace: true)]
        public string Endpoint { get; set; } = string.Empty;

        /// <summary>
        /// Key to access the AI service.
        /// </summary>
        [Required, NotEmptyOrWhitespace]
        public string Key { get; set; } = string.Empty;

    }

}
