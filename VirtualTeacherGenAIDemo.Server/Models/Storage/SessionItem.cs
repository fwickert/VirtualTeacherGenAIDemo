using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class SessionItem : IStorageEntity
    {
        public string Title { get; set; } = string.Empty;

        public DateTimeOffset Timestamp { get; set; }

        

        public string Id { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string UserId { get; set; } = string.Empty;

        [JsonIgnore]
        public string Partition => this.UserId;
        
        [Required]        
        public bool IsCompleted { get; set; } = false;

        public DateTimeOffset CompletedTimestamp { get; set; }

        [Required, NotEmptyOrWhitespace]
        public string ScenarioName { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string ScenarioDescription { get; set; } = string.Empty;

        [Required]
        public IEnumerable<SessionAgent> Agents { get; set; } = Enumerable.Empty<SessionAgent>();

    }

    public class SessionAgent
    {
        [Required, NotEmptyOrWhitespace]
        public string Prompt { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Type { get; set; } = string.Empty;


        [Required, NotEmptyOrWhitespace]
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public bool WithFileForSearch { get; set; } = false;

        [Required, NotEmptyOrWhitespace]
        public string Id { get; set; } = string.Empty;

        public List<PromptDashboardFeature> features { get; set; } = new List<PromptDashboardFeature>();

    }
}
