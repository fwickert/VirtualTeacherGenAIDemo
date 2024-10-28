using OpenAI.Chat;

namespace VirtualTeacherGenAIDemo.Server.Models.Request
{
    public class ChatHistoryRequest
    {
        public List<ChatMessage> Messages { get; set; } = new();
    }

    public class ChatMessage
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
