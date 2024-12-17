using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class LocaleRepository : Repository<LocaleItem>
    {
        public LocaleRepository(IStorageContext<LocaleItem> context) : base(context)
        {
        }

        //Get localitem by lang
        public async Task<IEnumerable<LocaleItem>> GetLocaleAsync(string lang)
        {
            return await base.StorageContext.QueryEntitiesAsync(e => e.Lang == lang);
        }
    }

}
