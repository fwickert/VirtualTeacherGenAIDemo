using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class AgentRepository : Repository<AgentItem>
    {
        public AgentRepository(IStorageContext<AgentItem> context) : base(context)
        {
        }

        public Task<IEnumerable<AgentItem>> GetAgentsByTypeAsync(string type)     
        {   
            return base.StorageContext.QueryEntitiesAsync(e => e.Type == type);
            
        }



        public Task<bool> HasFileNamesAsync(string agentId)
        {
            return base.StorageContext.ReadAsync(agentId, "rolePlay").ContinueWith(task =>
            {
                var agent = task.Result;
                return agent != null && agent.FileNames != null && agent.FileNames.Any();
            });
        }




        //function to return all agents
        public Task<IEnumerable<AgentItem>> GetAllAgentsAsync()
        {
            return base.StorageContext.QueryEntitiesAsync(e => true);
        }

        //function to retrun all agents depend on type and system agents
        public Task<IEnumerable<AgentItem>> GetAgentsAndSystemAsync(string type)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.Type == type || e.Type == "system");
        }

        //function Get by id
        public Task<AgentItem> GetAgentAsync(string id, string type)
        {
            return base.StorageContext.ReadAsync(id, type);
        }


        //add new agent
        public Task AddAgentAsync(AgentItem agent)
        {
            return base.StorageContext.UpsertAsync(agent);
        }

        //Update agent
        public Task UpdateAgentAsync(AgentItem agent)
        {
            return base.StorageContext.UpsertAsync(agent);
        }

        //Delete agent
        public Task DeleteAgentAsync(AgentItem agent)
        {
            return base.StorageContext.DeleteAsync(agent);
        }

        public Task<IEnumerable<AgentItem>> GetAgentsByFileNameAsync(string fileName)
        {
            return base.StorageContext.QueryEntitiesAsync(e => e.FileNames.Contains(fileName));
        }
    }    
}
