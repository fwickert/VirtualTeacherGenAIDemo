namespace VirtualTeacherGenAIDemo.Server.Models.Request
{
    public class DeleteMessageRequest
    {
        public string MessageId { get; set; }
        public string SessionId { get; set; }
    }
}
