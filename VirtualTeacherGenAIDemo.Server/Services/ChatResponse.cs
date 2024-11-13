using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Models;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class ChatResponse
    {
        private readonly ILogger<ChatResponse> _logger;
        private readonly IHubContext<MessageRelayHub> _messageRelayHubContext;
        private readonly AzureOpenAIChatCompletionService _chat;
        private readonly Kernel _kernel;
        private readonly int DELAY = 25;

        public ChatResponse(ILogger<ChatResponse> logger,
            [FromServices] Kernel kernel,
            [FromServices] AzureOpenAIChatCompletionService chat,
            [FromServices] IHubContext<MessageRelayHub> messageRelayHubContext)
        {
            _logger = logger;
            _kernel = kernel;
            _chat = chat;
            _messageRelayHubContext = messageRelayHubContext;
        }

        public async Task StartChat(string persona, string chatId,
            ChatHistory chatHistory,
            MessageRepository messageRepository,
            SessionRepository historyRepository,
            CancellationToken token)
        {
            

            ChatMessageContent promptSystem = chatHistory.FirstOrDefault(q => q.Role == AuthorRole.System)!;
            if (promptSystem != null)
            {
                if (string.IsNullOrEmpty(promptSystem.Content))
                {
                    promptSystem.Content = persona;
                }
            }

            if (string.IsNullOrEmpty(chatId))
            {
                chatId = Guid.NewGuid().ToString();
                string id = Guid.NewGuid().ToString();
                //create new historyItem
                SessionItem historyItem = new()
                {
                    Id = id,
                    ChatId = chatId,
                    Timestamp = DateTimeOffset.Now,
                    Title = "Simulation",
                    Type = "Session"
                };

                await historyRepository.UpsertAsync(historyItem);

                MessageResponse messageforUI = new()
                {   
                    ChatId = chatId,
                    State = "Session",
                    Id = id
                };
                await this.UpdateMessageOnClient("SessionInsert", messageforUI, token);
            }

            MessageResponse response = new MessageResponse
            {
                State = "Start",
                WhatAbout = "chat",
                ChatId = chatId,
                Role = AuthorRole.Assistant,                
            };
            await this.UpdateMessageOnClient("ReceiveMessageUpdate", response, token);

            await foreach (StreamingChatMessageContent chatUpdate in _chat.GetStreamingChatMessageContentsAsync(chatHistory, cancellationToken: token))
            {
                if (!string.IsNullOrEmpty(chatUpdate.Content))
                {
                    response.State = "InProgress";
                    response.Content += chatUpdate.Content;
                    await this.UpdateMessageOnClient("ReceiveMessageUpdate", response, token);
                    Console.Write(chatUpdate.Content);
                    await Task.Delay(DELAY);
                }
            }

            ////Take last message from chatHistory and save in cosmosDB.
            var lastMessage = chatHistory.Last(q => q.Role == AuthorRole.User);
            if (lastMessage != null)
            {
                Message userMessage = new()
                {
                    ChatId = chatId,
                    Content = lastMessage.Content!,
                    Timestamp = DateTimeOffset.Now,
                    Id = Guid.NewGuid().ToString(),
                    AuthorRole = Message.AuthorRoles.User
                };
                await messageRepository.UpsertAsync(userMessage);

                MessageResponse messageforUI = new()
                {
                    Content = lastMessage.Content!,
                    Role = AuthorRole.User,
                    ChatId = chatId,
                    State = "End",
                    Id = userMessage.Id
                };
                await this.UpdateMessageOnClient("UserIDUpdate", messageforUI, token);
            }

            //ajouter le message dans la BD
            Message message = new()
            {
                Content = response.Content,
            };
            message.Id = Guid.NewGuid().ToString();
            if (response.Role == AuthorRole.User)
            {
                message.AuthorRole = Message.AuthorRoles.User;
            }
            else
            {
                message.AuthorRole = Message.AuthorRoles.Assistant;
            }
            message.Timestamp = DateTimeOffset.Now;
            message.ChatId = chatId;
            messageRepository.UpsertAsync(message).GetAwaiter().GetResult();

            response.State = "End";
            response.Id = message.Id;
            response.ChatId = message.ChatId;
            chatHistory.AddAssistantMessage(response.Content);
            await this.UpdateMessageOnClient("ReceiveMessageUpdate",response, token);

        }

        /// <summary>
        /// Update the response on the client.
        /// </summary>
        /// <param name="message">The message</param>
        private async Task UpdateMessageOnClient(string hubconnection, MessageResponse message, CancellationToken token)
        {
            await this._messageRelayHubContext.Clients.All.SendAsync(hubconnection, message, token);
        }


    }
}
