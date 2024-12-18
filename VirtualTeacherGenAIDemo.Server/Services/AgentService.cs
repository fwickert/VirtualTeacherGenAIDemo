using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class AgentService
    {
        private readonly AgentRepository _agentRepository;
        private readonly IKernelMemory _kernelMemory;
        private readonly DocumentIntelligentOptions _options;

        public AgentService(AgentRepository agentRepository, IKernelMemory kernelMemory, IOptions<DocumentIntelligentOptions> options)
        {
            _agentRepository = agentRepository;
            _kernelMemory = kernelMemory;
            _options = options.Value;
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
            return await _agentRepository.GetAgentAsync(id, type);
        }

        public async Task<AgentItem> GetByIdAsync(string id)
        {
            return await _agentRepository.FindByIdAsync(id);
        }

        public async Task AddAgentAsync(AgentItem agent)
        {
            await _agentRepository.AddAgentAsync(agent);
        }

        public async Task UpdateAgentAsync(AgentItem agent)
        {
            await _agentRepository.UpdateAgentAsync(agent);

        }

        public async Task DeleteAgentAsync(AgentItem agent)
        {
            // Loop through each file and delete its entries in the search database
            foreach (var fileName in agent.FileNames)
            {
                MemoryFilter filter = new MemoryFilter();
                filter.Add("agentId", agent.Id);
                filter.Add("docName", fileName);

                SearchResult result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter);

                while (result.Results.Count > 0)
                {
                    foreach (var item in result.Results)
                    {
                        await _kernelMemory.DeleteDocumentAsync(item.DocumentId, index: _options.IndexName);
                    }
                    // Re-fetch the results after deletion
                    result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter);
                }
            }

            // Delete the agent from the repository
            await _agentRepository.DeleteAgentAsync(agent);
        }

    }
}
