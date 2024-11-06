﻿using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class ScenarioRepository : Repository<ScenarioItem>
    {
        public ScenarioRepository(IStorageContext<ScenarioItem> context) : base(context)
        {
        }

        public Task<IEnumerable<ScenarioItem>> GetScenariosAsync()
        {
            return base.StorageContext.QueryEntitiesAsync(q => true);

        }

        //function Get by id
        public Task<ScenarioItem> GetAsync(string id, string type)
        {
            return base.StorageContext.ReadAsync(id, type);
        }

        //Add new scenario
        public Task AddAsync(ScenarioItem scenario)
        {
            
            return base.StorageContext.CreateAsync(scenario);
        }
    }
    
}