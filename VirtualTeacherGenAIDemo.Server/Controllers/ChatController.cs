using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Security.Permissions;
using VirtualTeacherGenAIDemo.Server.Models.Request;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;


namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost(Name = "chat")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult Post([FromBody] ChatHistoryRequest chatHistory, CancellationToken token, [FromQuery] string chatId = "")
        {
            return _chatService.GetChat(chatId, chatHistory, token);
        }

        [HttpGet("history", Name = "history")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IEnumerable<SessionItem> Get(CancellationToken token)
        {
            return _chatService.GetHistory();
        }

        [HttpGet("messages/{chatid}", Name = "messages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<Message>> GetChatMessages(string chatId, CancellationToken token)
        {
            return await _chatService.GetChatMessages(chatId);
        }

        //Delete chat message
        [HttpDelete("messages/{messageId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task DeleteMessage(string messageId, string chatid,  CancellationToken token)
        {
            await _chatService.DeleteMessage(messageId, chatid);

        }

        //Complete Session
        [HttpPost("CompleteSession")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task CompleteSession([FromBody] CompleteSessionRequest request, CancellationToken token)
        {
            await _chatService.CompleteSession(request.SessionId, request.ChatId);
        }

        //Get all not complete session
        [HttpGet("Session/notCompleted")]
        public IEnumerable<SessionItem> GetNotCompletedSessions() 
        { 
            return _chatService.GetNotCompletedSession();
        }

        //Get a session by id
        [HttpGet("Session/{id}")]
        public async Task<SessionItem> GetSession(string id, string chatid)
        {
            return await _chatService.GetSession(id, chatid);
        }
    }
}
