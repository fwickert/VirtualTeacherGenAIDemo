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

        public List<UserSetting> Settings { get; set; } = new List<UserSetting>();

        [JsonIgnore]
        public string Partition => this.Id;
    }

    public enum RoleEnum
    {
        User = 0,
        Admin = 9
    }
}
