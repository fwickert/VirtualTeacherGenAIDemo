using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class ScenarioRepository : Repository<ScenarioItem>
    {
        public ScenarioRepository(IStorageContext<ScenarioItem> context) : base(context)
        {
        }

        public Task<IEnumerable<ScenarioItem>> GetScenariosAsyncByUser(string user)
        {
            return base.StorageContext.QueryEntitiesAsync(q => q.Users.Any(u=> u.UserId == user));

        }

        public Task<IEnumerable<ScenarioItem>> GetScenariosAsync()
        {
            return base.StorageContext.QueryEntitiesAsync(e => true);            

        }

        //function Get by id
        public Task<ScenarioItem> GetScenarioAsync(string id, string type)
        {
            return base.StorageContext.ReadAsync(id, type);
        }

        //Add new scenario
        public Task AddScenarioAsync(ScenarioItem scenario)
        {
            
            return base.StorageContext.CreateAsync(scenario);
        }

        //Update scenario
        public Task UpdateScenarioAsync(ScenarioItem scenario)
        {
            return base.StorageContext.UpsertAsync(scenario);
        }

        //Delete scenario
        public Task DeleteScenarioAsync(ScenarioItem scenario)
        {
            return base.StorageContext.DeleteAsync(scenario);
        }
    }
    
}
