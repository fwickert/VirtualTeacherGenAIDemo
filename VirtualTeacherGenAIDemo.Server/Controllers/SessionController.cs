using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        public SessionController(SessionService sessionService)
        {
            _sessionService = sessionService;
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
