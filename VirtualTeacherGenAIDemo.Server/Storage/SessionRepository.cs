using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class SessionRepository : Repository<SessionItem>
    {
        public SessionRepository(IStorageContext<SessionItem> context) : base(context)
        {
        }

        public IEnumerable<SessionItem> GetLastHistory(int limit)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.Type =="Session" && e.IsCompleted).Result.OrderByDescending(o=>o.Timestamp).Take(limit);
        }

        //add function to make IsCompeted true
        public async Task CompleteSession(string id, string chatId)
        {
            var session = await base.FindByIdAsync(id, chatId);
            if (session != null)
            {
                session.IsCompleted = true;
                await base.UpsertAsync(session);
            }
        }
    }
    
}
