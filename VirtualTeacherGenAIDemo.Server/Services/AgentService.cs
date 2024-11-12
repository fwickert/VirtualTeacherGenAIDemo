using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class AgentService
    {
        private readonly AgentRepository _agentRepository;

        public AgentService(AgentRepository agentRepository)
        {
            _agentRepository = agentRepository;
        }

        public async Task<IEnumerable<AgentItem>> GetByTypeAsync(string type)
        {        
            return await _agentRepository.GetAgentsByTypeAsync(type);            
        }
        
        public async Task<IEnumerable<AgentItem>> GetAgentsAndSystemAsync(string type)
        {
            return await _agentRepository.GetAgentsAndSystemAsync(type);
        }

        public async Task<IEnumerable<AgentItem>> GetAllAgentsAsync()
        {
            return await _agentRepository.GetAllAgentsAsync();
        }

        public async Task<AgentItem> GetByIdAsync(string id, string type)
        {
            return await _agentRepository.GetAsync(id, type);
        }

        public async Task AddAgentAsync(AgentItem agent)
        {
            await _agentRepository.AddAsync(agent);
        }
    }
}
