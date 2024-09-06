using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class HistoryItem : IStorageEntity
    {
        public string Title { get; set; } = string.Empty;
    
        public DateTimeOffset Timestamp { get; set; }

        public string Id { get; set; } = string.Empty;

        [JsonIgnore]
        public string Partition => this.ChatId;

        [Required, NotEmptyOrWhitespace]
        public string Type { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string ChatId { get; set; } = string.Empty;

    }
}
