using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class SessionRepository : Repository<SessionItem>
    {
        public SessionRepository(IStorageContext<SessionItem> context) : base(context)
        {
        }

        public IEnumerable<SessionItem> GetLastHistory(string userId)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.UserId == userId && e.IsCompleted).Result.OrderByDescending(o=>o.Timestamp);
        }

        //return Session taht not complete
        public IEnumerable<SessionItem> GetNotCompleteSession(string userId)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.UserId == userId && !e.IsCompleted).Result.OrderByDescending(o => o.Timestamp);
        }

        //Get one session by Id
        public async Task<SessionItem> GetSessionById(string id, string userId)
        {
            return await base.FindByIdAsync(id, userId);
        }

        //add function to make IsCompeted true
        public async Task CompleteSession(string id, string chatId)
        {
            var session = await base.FindByIdAsync(id, chatId);
            if (session != null)
            {
                session.IsCompleted = true;
                session.CompletedTimestamp = DateTimeOffset.Now;
                await base.UpsertAsync(session);
            }
        }

    }
    
}
