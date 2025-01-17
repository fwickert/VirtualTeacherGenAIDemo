using System.Collections;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class ScenarioService
    {

        private readonly ScenarioRepository _scenarioRepository;
        private readonly AgentRepository _agentRepository;

        public ScenarioService(ScenarioRepository scenarioRepository, AgentRepository agentRepository)
        {
            _scenarioRepository = scenarioRepository;
            _agentRepository = agentRepository;
        }

        public async Task<IEnumerable<ScenarioItem>> GetScenariosAsync()
        {
            IEnumerable<ScenarioItem> scenarios = await _scenarioRepository.GetScenariosAsync();


            return await _scenarioRepository.GetScenariosAsync();
        }

        public async Task<ScenarioItem> GetByIdAsync(string id, string type)
        {
            ScenarioItem? scenarioItem = await _scenarioRepository.GetScenarioAsync(id, type);

            //Agent? agent = scenarioItem?.Agents?.SingleOrDefault(a => a.Type == "rolePlay");

            //if (agent != null)
            //{
            //    bool files = await _agentRepository.HasFileNamesAsync(agent.Id);
            //    agent.WithFileForSearch = files;
            //}

            return scenarioItem!;
        }

        public async Task AddAsync(ScenarioItem scenario)
        {
            await _scenarioRepository.AddScenarioAsync(scenario);
        }

        public async Task UpdateAsync(ScenarioItem scenario)
        {
            await _scenarioRepository.UpdateScenarioAsync(scenario);
        }

        public async Task DeleteAsync(ScenarioItem scenario)
        {
            await _scenarioRepository.DeleteScenarioAsync(scenario);
        }

        public async Task<IEnumerable<ScenarioItem>> GetScenariosByAgentIdAsync(string agentId)
        {
            var scenarios = await _scenarioRepository.GetScenariosAsync();
            return scenarios.Where(s => s.Agents != null && s.Agents.Any(a => a.Id == agentId));
        }
    }
}
