namespace VirtualTeacherGenAIDemo.Server.Models.Request
{
    public class CompleteSessionRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string ChatId { get; set; } = string.Empty;
    }

}
