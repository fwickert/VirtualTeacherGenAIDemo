using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class AgentRepository : Repository<AgentItem>
    {
        public AgentRepository(IStorageContext<AgentItem> context) : base(context)
        {
        }

        public Task<IEnumerable<AgentItem>> FindByTypeAsync(string type)     
        {   
            return base.StorageContext.QueryEntitiesAsync(e => e.Type == type || e.Type == "system");
            
        }
    }    
}
