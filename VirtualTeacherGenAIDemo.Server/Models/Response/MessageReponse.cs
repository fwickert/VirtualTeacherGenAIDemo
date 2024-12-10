using Microsoft.SemanticKernel.ChatCompletion;

namespace VirtualTeacherGenAIDemo.Server.Models.Response
{
    public class MessageResponse
    {
        public string MessageId { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public AuthorRole? Role { get; set; }

        public string SessionId { get; set; } = string.Empty;

    }
}
