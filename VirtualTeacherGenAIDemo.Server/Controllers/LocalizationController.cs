using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalizationController : ControllerBase
    {
        private readonly LocalizationService _localizationService;

        public LocalizationController(LocalizationService localizationService)
        {
            _localizationService = localizationService;
        }

        [HttpGet("{lang}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLanguageFile(string lang)
        {
            IEnumerable<LocaleItem> result = await _localizationService.GetLanguageFileAsync(lang);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
