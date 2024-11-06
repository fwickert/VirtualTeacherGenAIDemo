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
            return base.StorageContext.QueryEntitiesAsync(e => e.Type == type || e.Type=="system");
            
        }

        //function Get by id
        public Task<AgentItem> GetAsync(string id, string type)
        {
            return base.StorageContext.ReadAsync(id, type);
        }


        //add new agent
        public Task AddAsync(AgentItem agent)
        {
            return base.StorageContext.CreateAsync(agent);
        }
    }    
}
