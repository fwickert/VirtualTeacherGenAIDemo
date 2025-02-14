using System.Text.Json.Serialization;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class UserSetting
    {
        [JsonPropertyName("language")]
        public string Language { get; set; } = string.Empty;


    }

    
}
