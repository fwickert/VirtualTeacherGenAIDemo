using System.IO;
using System.Threading.Tasks;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class LocalizationService
    {
        private readonly LocaleRepository _localeRepository;

        public LocalizationService(LocaleRepository localeRepository)
        {
            _localeRepository = localeRepository;
        }

        public async Task<IEnumerable<LocaleItem>> GetLanguageFileAsync(string lang)
        {
            var result = await _localeRepository.GetLocaleAsync(lang);
            if (result == null)
            {
                return null;
            }
            return result;
        }
    }
}
