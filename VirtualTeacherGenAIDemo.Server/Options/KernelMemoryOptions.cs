using static Microsoft.KernelMemory.AzureOpenAIConfig;

namespace VirtualTeacherGenAIDemo.Server.Options
{


    public class KernelMemoryOptions
    {
        public const string SectionName = "KernelMemory";
        public required Services Services { get; set; }
    }

    public class Services
    {
        public required Azureaisearch AzureAISearch { get; set; }
        public required Azureopenaiembedding AzureOpenAIEmbedding { get; set; }
        public required Azureopenaitext AzureOpenAIText { get; set; }
    }

    public class Azureaisearch
    {
        public Microsoft.KernelMemory.AzureAISearchConfig.AuthTypes Auth { get; set; }
        public required string Endpoint { get; set; }
        public required string APIKey { get; set; }
        public bool UseHybridSearch { get; set; }
        public bool UseStickySessions { get; set; }
    }

    public class Azureopenaiembedding
    {
        public AuthTypes Auth { get; set; }
        public required string Endpoint { get; set; }
        public required string APIKey { get; set; }
        public required string Deployment { get; set; }
        public int MaxTokenTotal { get; set; }
        public int? EmbeddingDimensions { get; set; }
        public int MaxEmbeddingBatchSize { get; set; }
        public int MaxRetries { get; set; }
    }

    public class Azureopenaitext
    {
        public AuthTypes Auth { get; set; }
        public required string Endpoint { get; set; }
        public required string APIKey { get; set; }
        public required string Deployment { get; set; }
        public int MaxTokenTotal { get; set; }
        public APITypes APIType { get; set; }
        public int MaxRetries { get; set; }
    }

}
