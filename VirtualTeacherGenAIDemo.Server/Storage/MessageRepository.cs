using VirtualTeacherGenAIDemo.Server.Models;
using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class MessageRepository : Repository<Message>
    {
        
        public MessageRepository(IStorageContext<Message> context) : base(context)
        {
        }

        public Task<IEnumerable<Message>> FindByChatIdAsync(string chatId)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.ChatId == chatId);
        }        

       
       
    }
}
