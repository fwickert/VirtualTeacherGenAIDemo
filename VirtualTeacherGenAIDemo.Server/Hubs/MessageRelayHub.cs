using Microsoft.AspNetCore.SignalR;

namespace VirtualTeacherGenAIDemo.Server.Hubs
{
    public class MessageRelayHub : Hub
    {
        private const string ReceiveMessageClientCall = "ReceiveMessage";        
        private const string ReceiveDashboardClientCall = "ReceiveDashboard";
        private readonly ILogger<MessageRelayHub> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageRelayHub"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public MessageRelayHub(ILogger<MessageRelayHub> logger)
        {
            this._logger = logger;
        }


        /// <summary>
        /// Sends a message to all users except the sender.
        /// </summary>
        /// <param name="chatId">The chat ID used as group id for SignalR.</param>
        /// <param name="senderId">The user ID of the user that sent the message.</param>
        /// <param name="message">The message to send.</param>
        public async Task SendMessageAsync(string chatId, string senderId, object message)
        {
            //await this.Clients.OthersInGroup(chatId).SendAsync(ReceiveMessageClientCall, chatId, senderId, message);
            await this.Clients.All.SendAsync(ReceiveMessageClientCall, chatId, senderId, message);
        }


        public async Task SendDashboardAsync(string chatId, string userId, object dashboard)
        {
            await this.Clients.All.SendAsync(ReceiveDashboardClientCall, chatId, userId, dashboard);
        }

    }
}
