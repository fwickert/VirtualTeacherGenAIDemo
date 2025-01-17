using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VirtualTeacherGenAIDemo.Server.Storage;
using VirtualTeacherGenAIDemo.Server.Options;


namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class ScenarioItem : IStorageEntity
    {
        public string Id { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Name { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Description { get; set; } = string.Empty;

        [Required]
        public IEnumerable<Agent>? Agents { get; set; } 

        [JsonIgnore]
        public string Partition => this.Id;
    }

    public class Agent
    {
        [Required, NotEmptyOrWhitespace]
        public string Id { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Name { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Prompt { get; set; } = string.Empty;

        [JsonIgnore]
        public bool WithFileForSearch { get; set; } = false;

        [Required, NotEmptyOrWhitespace]
        public string Type { get; set; } = string.Empty;

        public List<PromptDashboardFeature> features { get; set; } = new List<PromptDashboardFeature>();


    }
}
