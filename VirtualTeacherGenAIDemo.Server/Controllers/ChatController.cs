using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;


namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
     
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
