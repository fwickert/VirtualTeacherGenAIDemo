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
        private readonly AssistantOption _assistantOption;
        private readonly MessageRepository _messageRepository;
        private readonly HistoryRepository _historyRepository;


        public ChatService([FromServices] MessageRepository messageRepository, 
            [FromServices] HistoryRepository historyRepository, 
            [FromServices] ChatResponse chatResponse, 
            IOptions<AssistantOption> option)
        {
            _messageRepository = messageRepository;
            _historyRepository = historyRepository;
            _chatResponse = chatResponse;
            _assistantOption = option.Value;            
        }

        //Creater function to call GetAsync in other thread without asunc/await and with cancellation token in parameters
        public IResult GetChat(string chatId, ChatHistoryRequest chatHistory, CancellationToken token)
        {
            //Transform ChatHistoryRequest to ChatHistory
            ChatHistory SKHistory = new ChatHistory();
            foreach (var message in chatHistory.Messages)
            {
                switch (message.Role)
                {
                    case "User":
                        SKHistory.AddUserMessage(message.Content);
                        break;
                    case "System":
                        SKHistory.AddSystemMessage(message.Content);
                        break;
                }
            }

            Task.Run(() => _chatResponse.StartChat(_assistantOption.Persona, chatId, SKHistory, _messageRepository, _historyRepository, token), token); 

            return TypedResults.Ok("Chat requested");
        }

        //Get list of 10 last Conversations
        public IEnumerable<HistoryItem> GetHistory()
        {
            return _historyRepository.GetLastHistory(10);
        }

        public async Task<HistoryItem> GetDashboard(string id, string chatId)
        {
            return await _historyRepository.FindByIdAsync(id, chatId);
        }

        //return all message from a chatid
        public async Task<IEnumerable<Message>> GetChatMessages(string chatId)
        {
            return await _messageRepository.FindByChatIdAsync(chatId);
        }

       
    }
}
