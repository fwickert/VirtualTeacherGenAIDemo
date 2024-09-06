using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class DashboardItem : IStorageEntity
    {
        [Required, NotEmptyOrWhitespace]
        public string ChatId { get; set; } = string.Empty;

        public string Id { get; set; } = string.Empty;

        [JsonIgnore]
        public string Partition => this.ChatId;

        public string InfoType { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        
    }
}
