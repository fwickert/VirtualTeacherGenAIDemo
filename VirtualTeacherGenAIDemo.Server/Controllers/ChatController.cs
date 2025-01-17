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

        [HttpPost("message",Name = "message")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IResult Post([FromBody] ChatHistoryRequest chatHistory,string agentId, string connectionId,bool hasFiles, CancellationToken token)
        {
            return _chatService.GetChat(chatHistory,agentId,connectionId, hasFiles, token);
        }


        [HttpGet("messages/{sessionid}", Name = "messages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<MessageItem>?> GetChatMessages(string sessionId, CancellationToken token)
        {
            IEnumerable<MessageItem> messages =  await _chatService.GetChatMessages(sessionId);
                      
            return messages;
        }

        //Delete chat message
        [HttpDelete("message/{messageId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task DeleteMessage([FromBody] DeleteMessageRequest message,  CancellationToken token)
        {
            await _chatService.DeleteMessage(message.MessageId, message.SessionId);

        }

    }
}
