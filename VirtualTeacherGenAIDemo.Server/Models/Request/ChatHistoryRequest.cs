using OpenAI.Chat;
using System.ComponentModel.DataAnnotations;
using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Models.Request
{
    public class ChatHistoryRequest
    {
        public string UserId { get; set; } = string.Empty;
        public SessionItem? Session { get; set; }
        public List<ChatMessage> Messages { get; set; } = new();
    }

    public class ChatMessage
    {
        public AuthorRole Role { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
    }

    public enum AuthorRole
    {
        User,
        Assistant,
        System
    }
}
