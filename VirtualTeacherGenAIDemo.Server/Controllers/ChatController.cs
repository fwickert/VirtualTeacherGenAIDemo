using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel.ChatCompletion;
using VirtualTeacherGenAIDemo.Server.Models.Request;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;


namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        [HttpPost(Name = "chat")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult Post([FromServices] ChatService chatService, [FromBody] ChatHistoryRequest chatHistory, CancellationToken token, [FromQuery] string chatId = "")
        {
            return chatService.GetChat(chatId, chatHistory, token);
        }

        [HttpGet("history", Name = "history")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IEnumerable<HistoryItem> Get([FromServices] ChatService chatService, CancellationToken token)
        {
            return chatService.GetHistory();
        }

        [HttpGet("messages", Name = "messages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<Message>> GetChatMessages([FromServices] ChatService chatService, string chatId, CancellationToken token)
        {
            return await chatService.GetChatMessages(chatId);
        }
    }
}
