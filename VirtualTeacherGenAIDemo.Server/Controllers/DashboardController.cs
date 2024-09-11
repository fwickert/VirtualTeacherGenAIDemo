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
        public IResult Post([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest, CancellationToken token)
        {
            //Check if conversation, chatId, connectionId, and id are not null
            if (string.IsNullOrEmpty(dashboardRequest.Conversation) || string.IsNullOrEmpty(dashboardRequest.ChatId) ||
                string.IsNullOrEmpty(dashboardRequest.ConnectionId) || string.IsNullOrEmpty(dashboardRequest.Id))
            {
                return TypedResults.BadRequest("Invalid request : Invalid Body");
            }

            return dashboardService.GetSummarize(dashboardRequest, token);
        }

        [HttpPost("products", Name = "products")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult PostProducts([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest, CancellationToken token)
        {
            return dashboardService.GetProducts(dashboardRequest, token);
        }

        //same for keywords
        [HttpPost("keywords", Name = "keywords")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult PostKeywords([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest, CancellationToken token)
        {
            return dashboardService.GetKeywords(dashboardRequest, token);
        }

        //same for advice
        [HttpPost("advice", Name = "advice")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult PostAdvice([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest, CancellationToken token)
        {
            return dashboardService.GetAdvice(dashboardRequest, token);
        }

        //same for Example
        [HttpPost("example", Name = "example")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult PostExample([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest, CancellationToken token)
        {
            return dashboardService.GetExample(dashboardRequest, token);
        }

        //same for evaluation
        [HttpPost("evaluation", Name = "evaluation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult PostEvaluation([FromServices] DashboardService dashboardService, [FromBody] DashboardRequest dashboardRequest, CancellationToken token)
        {
            return dashboardService.GetEvaluation(dashboardRequest, token);
        }


    }


}
