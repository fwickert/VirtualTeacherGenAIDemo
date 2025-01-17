using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Models.Request;
using VirtualTeacherGenAIDemo.Server.Models.Response;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class ChatResponse
    {
        private readonly ILogger<ChatResponse> _logger;
        private readonly IHubContext<MessageRelayHub> _messageRelayHubContext;
        private readonly IChatCompletionService _chat;
        private readonly Kernel _kernel;
        private readonly int DELAY = 25;

        public ChatResponse(ILogger<ChatResponse> logger,
            [FromServices] IHubContext<MessageRelayHub> messageRelayHubContext,
            [FromServices] Kernel kernel)
        {
            _logger = logger;
            _kernel = kernel;
            _chat = _kernel.GetRequiredService<IChatCompletionService>();
            _messageRelayHubContext = messageRelayHubContext;

        }

        public async Task StartChat(string connectionId,
            ChatHistory chatHistory,
            string userId,
            SessionItem session,
            List<ChatMessage> messages,
            bool hasFiles,
            MessageRepository messageRepository,
            SessionRepository sessionRepository,
            CancellationToken token)
        {


            if (string.IsNullOrEmpty(session.Id))
            {
                session.Id = Guid.NewGuid().ToString();
                SessionItem historyItem = new()
                {
                    Id = session.Id,
                    Timestamp = session.Timestamp,
                    Title = session.ScenarioName, //string.IsNullOrEmpty(session.Title) ? "Title to be created by LLM" : session.Title, // Use default title if empty
                    UserId = session.UserId,
                    ScenarioName = session.ScenarioName,
                    ScenarioDescription = session.ScenarioDescription,
                    Agents = session.Agents,
                    IsCompleted = false,                   
                };

                await sessionRepository.UpsertAsync(historyItem);


                MessageResponse messageforUI = new()
                {
                    SessionId = session.Id,
                };
                await this.UpdateMessageOnClient("SessionInsert", messageforUI, connectionId, token);
            }

            await this.UpdateMessageOnClient("StartMessageUpdate", null, connectionId, token);

            OpenAIPromptExecutionSettings openAIPromptExecutionSettings = new()
            {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
            };

            MessageResponse response = new MessageResponse
            {
                SessionId = session.Id,
                Role = Microsoft.SemanticKernel.ChatCompletion.AuthorRole.Assistant,
                Content = string.Empty,

            };


            ChatMessageContent? lastUserMessage = null;
            
            
            string searchText = "";

            if (hasFiles)
            {
                lastUserMessage = chatHistory.LastOrDefault(m => m.Role == Microsoft.SemanticKernel.ChatCompletion.AuthorRole.User);
                searchText = ". Only for internal Process : If needed, use search tool to find information";
                if (lastUserMessage != null)
                {
                    lastUserMessage.Content += searchText;
                }
            }            

            await foreach (StreamingChatMessageContent chatUpdate in _chat.GetStreamingChatMessageContentsAsync(chatHistory,
                executionSettings: openAIPromptExecutionSettings,
                kernel: _kernel,
                cancellationToken: token))
            {
                if (!string.IsNullOrEmpty(chatUpdate.Content))
                {
                    response.Content += chatUpdate.Content;
                    await this.UpdateMessageOnClient("InProgressMessageUpdate", response, connectionId, token);
                    Console.Write(chatUpdate.Content);
                    //await Task.Delay(DELAY);
                }
            }

            // Revert the last user message to its original content
            if (lastUserMessage != null)
            {
                lastUserMessage.Content = lastUserMessage.Content?.Replace(searchText, string.Empty);
            }

            ////Take last message from chatHistory and save in cosmosDB.
            var lastMessage = messages.Last(q => q.Role == Models.Request.AuthorRole.User);
            if (lastMessage != null)
            {
                MessageItem userMessage = new()
                {
                    SessionId = session.Id,
                    Content = lastMessage.Content!,
                    Timestamp = DateTimeOffset.Now,
                    Id = lastMessage.Id,
                    AuthorRole = MessageItem.AuthorRoles.User
                };
                await messageRepository.UpsertAsync(userMessage);

                MessageResponse messageforUI = new()
                {
                    MessageId = userMessage.Id,
                    SessionId = session.Id,
                };
                await this.UpdateMessageOnClient("MessageIdUpdate", messageforUI, connectionId, token);
            }

            //ajouter le message dans la BD
            MessageItem message = new()
            {
                Content = response.Content,
            };
            message.Id = Guid.NewGuid().ToString();
            message.AuthorRole = MessageItem.AuthorRoles.Assistant;
            message.Timestamp = DateTimeOffset.Now;
            message.SessionId = session.Id;
            messageRepository.UpsertAsync(message).GetAwaiter().GetResult();


            response.MessageId = message.Id;
            response.SessionId = message.SessionId;
            await this.UpdateMessageOnClient("EndMessageUpdate", response, connectionId, token);

        }



        /// <summary>
        /// Update the response on the client.
        /// </summary>
        /// <param name="message">The message</param>
        private async Task UpdateMessageOnClient(string hubconnection, MessageResponse? message, string connectionId, CancellationToken token)
        {
            await this._messageRelayHubContext.Clients.Client(connectionId).SendAsync(hubconnection, message, token);
        }
    }
}
