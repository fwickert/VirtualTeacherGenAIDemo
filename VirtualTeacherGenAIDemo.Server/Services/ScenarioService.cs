using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class ScenarioService
    {

        private readonly ScenarioRepository _scenarioRepository;

        public ScenarioService(ScenarioRepository scenarioRepository)
        {
            _scenarioRepository = scenarioRepository;
        }

        public async Task<IEnumerable<ScenarioItem>> GetScenariosAsync()
        {
            return await _scenarioRepository.GetScenariosAsync();
        }

        public async Task<ScenarioItem> GetByIdAsync(string id, string type)
        {
            return await _scenarioRepository.GetAsync(id, type);
        }

        public async Task AddAsync(ScenarioItem scenario)
        {
            await _scenarioRepository.AddAsync(scenario);
        }
    }
}
