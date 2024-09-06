using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        [HttpGet()]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<DashboardItem>> Get([FromServices] DashboardService dashboardService, string chatId, CancellationToken token)
        {
            return await dashboardService.GetDashboard(chatId);
        }
    }
}
