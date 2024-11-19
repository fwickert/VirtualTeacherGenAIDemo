using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class UserItem : IStorageEntity
    {
        [Required, NotEmptyOrWhitespace]
        public string Id { get; set; } = string.Empty;
                        
        public RoleEnum Role { get; set; } = RoleEnum.User;

        public IDictionary<string, string> Settings { get; set; } = new Dictionary<string, string>();

        [JsonIgnore]
        public string Partition => this.Id;
    }

    public enum RoleEnum
    {
        User = 0,
        Admin = 9
    }
}
