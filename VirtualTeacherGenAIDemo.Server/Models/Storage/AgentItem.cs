using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class AgentItem : IStorageEntity
    {
        [Required, NotEmptyOrWhitespace]
        public string Name { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Description { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Prompt { get; set; } = string.Empty;

        public string Id { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Type { get; set; } = string.Empty;

        public string FileName { get; set; } = string.Empty;

        [JsonIgnore]
        public string Partition => this.Type;


    }
}
