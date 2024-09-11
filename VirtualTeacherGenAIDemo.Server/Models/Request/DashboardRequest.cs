namespace VirtualTeacherGenAIDemo.Server.Models
{
    public class DashboardRequest
    {
        public string ChatId { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public string Conversation { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
    }
}
