using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class HistoryRepository : Repository<HistoryItem>
    {
        public HistoryRepository(IStorageContext<HistoryItem> context) : base(context)
        {
        }

        public IEnumerable<HistoryItem> GetLastHistory(int limit)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.Type =="Session").Result.OrderByDescending(o=>o.Timestamp).Take(limit);
        }
    }
    
}
