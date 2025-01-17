using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel.ChatCompletion;
using VirtualTeacherGenAIDemo.Server.Models.Request;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class ChatService
    {
        private readonly ChatResponse _chatResponse;        
        private readonly MessageRepository _messageRepository;
        private readonly SessionRepository _sessionRepository;


        public ChatService([FromServices] MessageRepository messageRepository,
            [FromServices] SessionRepository sessionRepository,
            [FromServices] ChatResponse chatResponse)
        {
            _messageRepository = messageRepository;
            _sessionRepository = sessionRepository;
            _chatResponse = chatResponse;
         
        }

        //Creater function to call GetAsync in other thread without asunc/await and with cancellation token in parameters
        public IResult GetChat(ChatHistoryRequest chatHistory, string agentId, string connectionId, bool hasFiles, CancellationToken token)
        {
            //Transform ChatHistoryRequest to ChatHistory
            ChatHistory SKHistory = new ChatHistory();
            foreach (var message in chatHistory.Messages)
            {
                switch (message.Role)
                {
                    case Models.Request.AuthorRole.User:
                        SKHistory.AddUserMessage(message.Content);
                        break;
                    case Models.Request.AuthorRole.System:
                        SKHistory.AddSystemMessage($"agentId:{agentId}\n" + message.Content);
                        break;
                    case Models.Request.AuthorRole.Assistant:
                        SKHistory.AddAssistantMessage(message.Content);
                        break;
                }
            }
            if (chatHistory.Session != null)
            {
                Task.Run(() => _chatResponse.StartChat(connectionId, SKHistory, chatHistory.UserId, 
                    chatHistory.Session, chatHistory.Messages, hasFiles,
                    _messageRepository, _sessionRepository, 
                    token), token);
            }


            return TypedResults.Ok("Chat requested");
        }



        //return all message from a chatid
        public async Task<IEnumerable<MessageItem>> GetChatMessages(string userId)
        {
            IEnumerable<MessageItem> messages = await _messageRepository.FindByChatIdAsync(userId);

            return messages;
        }

        //Delete a message by id
        public async Task DeleteMessage(string messageId, string sessionId)
        {
            await _messageRepository.DeleteMessageByIdAsync(messageId, sessionId);
        }


    }
}
