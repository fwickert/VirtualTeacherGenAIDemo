namespace VirtualTeacherGenAIDemo.Server.Models.Request
{
    public class CompleteSessionRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }

}
