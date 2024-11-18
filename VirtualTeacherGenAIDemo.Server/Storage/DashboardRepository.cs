using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class DashboardRepository : Repository<DashboardItem>
    {
        public DashboardRepository(IStorageContext<DashboardItem> context) : base(context)
        {
        }

        public Task<IEnumerable<DashboardItem>> FindByChatIdAsync(string sessionId)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.SessionId == sessionId);
        }
    }
}
