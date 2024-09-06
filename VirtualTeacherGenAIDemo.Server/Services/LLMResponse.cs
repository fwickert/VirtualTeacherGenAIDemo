using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.SemanticKernel;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Models;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class LLMResponse
    {
        private readonly ILogger<LLMResponse> _logger;
        private readonly DashboardRepository _dashboardRepository;
        private readonly IHubContext<MessageRelayHub> _messageRelayHubContext;
        private readonly Kernel _kernel;
        private string _pluginsDirectory = string.Empty;
        private readonly int DELAY = 25;

        public string PluginName { get; set; } = string.Empty;
        public string FunctionName { get; set; } = string.Empty;


        public LLMResponse(ILogger<LLMResponse> logger, [FromServices] Kernel kernel,
            [FromServices] DashboardRepository dashboardRepository, [FromServices] IHubContext<MessageRelayHub> messageRelayHubContext)
        {
            _logger = logger;
            _kernel = kernel;
            _dashboardRepository = dashboardRepository;
            _messageRelayHubContext = messageRelayHubContext;            
            _pluginsDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Plugins");
        }

        public async Task GetAsync(string chatId, string id, string whatAbout, Dictionary<string, string> variablesContext, CancellationToken token)
        {
            var arguments = new KernelArguments();

            foreach (var item in variablesContext)
            {
                arguments[item.Key] = item.Value;
            }

            await StreamResponseToClient(chatId, id, whatAbout, arguments, token);
        }

        public async Task GetCoachAsync(string whatAbout, Dictionary<string, string> variablesContext, CancellationToken token)
        {
            var arguments = new KernelArguments();

            foreach (var item in variablesContext)
            {
                arguments[item.Key] = item.Value;
            }

            await StreamResponseCoachToClient(whatAbout, arguments, token);
        }

        private async Task<MessageResponse> StreamResponseCoachToClient(string whatAbout, KernelArguments arguments, CancellationToken token)
        {

            MessageResponse messageResponse = new MessageResponse
            {
                State = "Start",
                Content = "",
                WhatAbout = whatAbout
            };

            await foreach (StreamingChatMessageContent contentPiece in _kernel.InvokeStreamingAsync<StreamingChatMessageContent>(_kernel.Plugins[this.PluginName][this.FunctionName], arguments, token))
            {
                await this.UpdateMessageOnClient(messageResponse, token);
                messageResponse.State = "InProgress";

                if (!string.IsNullOrEmpty(contentPiece.Content))
                {
                    messageResponse.Content += contentPiece.Content;
                    await this.UpdateMessageOnClient(messageResponse, token);
                    Console.Write(contentPiece.Content);
                    await Task.Delay(DELAY);
                }
            }
            messageResponse.State = "End";

            await this.UpdateMessageOnClient(messageResponse, token);
            return messageResponse;
        }

        private async Task<MessageResponse> StreamResponseToClient(string chatId, string id, string whatAbout, KernelArguments arguments, CancellationToken token)
        {

            MessageResponse messageResponse = new MessageResponse
            {
                State = "Start",
                Content = "",
                WhatAbout = whatAbout
            };

            await foreach (StreamingChatMessageContent contentPiece in _kernel.InvokeStreamingAsync<StreamingChatMessageContent>(_kernel.Plugins[this.PluginName][this.FunctionName], arguments, token))
            {
                await this.UpdateMessageOnClient( messageResponse,  token);
                messageResponse.State = "InProgress";

                if (!string.IsNullOrEmpty(contentPiece.Content))
                {
                    messageResponse.Content += contentPiece.Content;
                    await this.UpdateMessageOnClient( messageResponse, token);
                    Console.Write(contentPiece.Content);
                    await Task.Delay(DELAY);
                }
            }
            messageResponse.State = "End";

            //Save content in DB
            await this._dashboardRepository.UpsertAsync(new DashboardItem { 
                ChatId = chatId,
                Content = messageResponse.Content,
                Id = id != null && id != "" ? id : Guid.NewGuid().ToString(),
                InfoType = whatAbout
            });

            await this.UpdateMessageOnClient( messageResponse, token);
            return messageResponse;
        }

        /// <summary>
        /// Update the response on the client.
        /// </summary>
        /// <param name="message">The message</param>
        private async Task UpdateMessageOnClient(MessageResponse message, CancellationToken token)
        {
            await this._messageRelayHubContext.Clients.All.SendAsync("ReceiveDashboard", message, token);
        }

    }
}
