using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models;
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

        [HttpPost("summary", Name = "summary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IResult> Post([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest,
            string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            //Check if conversation, chatId, connectionId, and id are not null
            if (string.IsNullOrEmpty(dashboardRequest.Conversation) || string.IsNullOrEmpty(dashboardRequest.SessionId) ||
                string.IsNullOrEmpty(dashboardRequest.ConnectionId))
            {
                return TypedResults.BadRequest("Invalid request : Invalid Body");
            }

            return await dashboardService.GetSummarize(dashboardRequest, sessionId, userName, refreshUI, token);
        }

        [HttpPost("products", Name = "products")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IResult> PostProducts([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest,
            string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            return await dashboardService.GetProducts(dashboardRequest, sessionId, userName, refreshUI, token);
        }

        //same for keywords
        [HttpPost("keywords", Name = "keywords")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IResult> PostKeywords([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest,
            string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            return await dashboardService.GetKeywords(dashboardRequest, sessionId, userName, refreshUI, token);
        }

        //same for advice
        [HttpPost("advice", Name = "advice")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IResult> PostAdvice([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest,
            string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            return await dashboardService.GetAdvice(dashboardRequest, sessionId, userName, refreshUI, token);
        }

        //same for Example
        [HttpPost("example", Name = "example")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IResult> PostExample([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest,
            string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            return await dashboardService.GetExample(dashboardRequest, sessionId, userName, refreshUI, token);
        }

        //same for evaluation
        [HttpPost("evaluation", Name = "evaluation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IResult> PostEvaluation([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest,
            string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            return await dashboardService.GetEvaluation(dashboardRequest, sessionId, userName, refreshUI, token);
        }
    }
}
