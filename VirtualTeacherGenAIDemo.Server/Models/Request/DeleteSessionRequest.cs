namespace VirtualTeacherGenAIDemo.Server.Models.Request
{
    public class DeleteSessionRequest
    {
        public required string SessionId { get; set; }
        public required string UserId { get; set; } 
    }
}
