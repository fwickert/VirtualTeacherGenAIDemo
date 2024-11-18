using VirtualTeacherGenAIDemo.Server.Models;
using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class MessageRepository : Repository<MessageItem>
    {
        
        public MessageRepository(IStorageContext<MessageItem> context) : base(context)
        {
        }

        public async Task<IEnumerable<MessageItem>> FindByChatIdAsync(string sessionId)
        {
            IEnumerable<MessageItem> messages = await base.StorageContext.QueryEntitiesAsync(e => e.SessionId == sessionId);

            return messages;
        }

        public async Task DeleteMessageByIdAsync(string messageId, string sessionId)
        {
            var message = await base.FindByIdAsync(messageId, sessionId);
            if (message != null)
            {
                await base.DeleteAsync(message);
            }
        }

    }
}
