using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using VirtualTeacherGenAIDemo.Server.Models;
using VirtualTeacherGenAIDemo.Server.Models.Request;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly SessionService _sessionService;
        private readonly DashboardService _dashboardService;
        private readonly ChatService _chatService;

        public SessionController(SessionService sessionService, DashboardService dashboardService, ChatService chatService)
        {
            _sessionService = sessionService;
            _dashboardService = dashboardService;
            _chatService = chatService;
        }


        [HttpGet("history/{userId}", Name = "history")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IEnumerable<SessionItem> Get(string userId, CancellationToken token)
        {
            return _sessionService.GetHistory(userId);
        }

        //Complete Session
        [HttpPost("CompleteSession")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task CompleteSession([FromBody] CompleteSessionRequest request, CancellationToken token)
        {
            await _sessionService.CompleteSession(request.SessionId, request.UserId);

            //Get the dashboard
            IEnumerable<DashboardItem> dashboard = await _dashboardService.GetDashboard(request.SessionId);

            var summary = dashboard.FirstOrDefault(q => q.InfoType == "Summary");
            var products = dashboard.FirstOrDefault(q => q.InfoType == "Products");
            var keywords = dashboard.FirstOrDefault(q => q.InfoType == "Keywords");
            var advice = dashboard.FirstOrDefault(q => q.InfoType == "Advice");

            //Crate dahsbopardrequest object conversation id the 
            DashboardRequest forSummary = new DashboardRequest();
            forSummary.SessionId = request.SessionId;            
            forSummary.Id = Guid.NewGuid().ToString();
            forSummary.Title = "Summary";

            //same for products
            DashboardRequest forProducts = new DashboardRequest();
            forProducts.SessionId = request.SessionId;
            forProducts.Id = Guid.NewGuid().ToString();
            forProducts.Title = "Products";

            //same for keywords
            DashboardRequest forKeywords = new DashboardRequest();
            forKeywords.SessionId = request.SessionId;
            forKeywords.Id = Guid.NewGuid().ToString();
            forKeywords.Title = "Keywords";

            //same for advice
            DashboardRequest forAdvice = new DashboardRequest();
            forAdvice.SessionId = request.SessionId;
            forAdvice.Id = Guid.NewGuid().ToString();
            forAdvice.Title = "Advice";


            StringBuilder conversation = new StringBuilder();
            //get messages
            var messages = await _chatService.GetChatMessages(request.SessionId);
            foreach(var message in messages)
            {
                conversation.Append(message.Content);
            }

            forSummary.Conversation = conversation.ToString();
            forProducts.Conversation = conversation.ToString();
            forKeywords.Conversation = conversation.ToString();
            forAdvice.Conversation = conversation.ToString();

            await _dashboardService.GetSummarize(forSummary, request.SessionId, request.UserId,false, token);
            await _dashboardService.GetProducts(forProducts, request.SessionId, request.UserId,false, token);
            await _dashboardService.GetKeywords(forKeywords, request.SessionId, request.UserId,false, token);
            await _dashboardService.GetAdvice(forAdvice, request.SessionId, request.UserId,false, token);            

        }

        //Get all not complete session
        [HttpGet("notCompleted/{userId}", Name = "sessions")]
        public IEnumerable<SessionItem> GetNotCompletedSessions(string userId)
        {
            return _sessionService.GetNotCompletedSession(userId);
        }


        //Get a session by id
        [HttpGet("{Id}")]
        public async Task<SessionItem> GetSession(string id, string userId)
        {
            return await _sessionService.GetSession(id, userId);
        }

        [HttpDelete("delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteSession([FromBody] DeleteSessionRequest request, [FromServices] MessageRepository messageRepository, CancellationToken token)
        {
            await _sessionService.DeleteSessionAsync(request.SessionId, request.UserId, messageRepository, token);
            return Ok();
        }


    }
}
