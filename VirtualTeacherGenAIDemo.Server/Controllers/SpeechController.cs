using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using VirtualTeacherGenAIDemo.Server.Options;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpeechController : ControllerBase
    {
        private readonly SpeechOptions _options;
                
        public SpeechController(IOptions<SpeechOptions> options)
        {
            _options = options.Value;
        }

        [HttpGet("config", Name = "config")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public SpeechOptions Get()
        {
            return _options;
        }
    }
}
