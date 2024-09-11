using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.API.Models;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromptController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public PromptController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<string> Post([FromBody] Prompt prompt)
        {
            return await _dashboardService.GetPrompt(prompt.FunctionName, prompt.Plugin);
        }
    }
}
