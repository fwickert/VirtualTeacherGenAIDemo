using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class MessageItem() : IStorageEntity
    {   

        [Required, NotEmptyOrWhitespace]
        public string Id { get; set; } = string.Empty;

        public string SessionId { get; set; } = string.Empty;

        public enum AuthorRoles
        {           
            User = 0,            
            Assistant = 1
        }

        [Required, NotEmptyOrWhitespace]
        public string Content { get; set; } = string.Empty;

        public DateTimeOffset Timestamp { get; set; }

        public AuthorRoles AuthorRole { get; set; }

        [JsonIgnore]
        public string Partition => this.SessionId;

       
    }
}
