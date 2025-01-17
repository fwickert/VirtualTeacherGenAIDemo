using Elastic.Clients.Elasticsearch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.SemanticKernel;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Models.Response;
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

        public async Task GetAsync(string sessionId, string id, string whatAbout, Dictionary<string, string> variablesContext, 
            string connectionId, bool refreshUI, CancellationToken token)
        {
            var arguments = new KernelArguments();

            foreach (var item in variablesContext)
            {
                arguments[item.Key] = item.Value;
            }


            if (refreshUI)
            {
                await StreamResponseToClient(sessionId, id, whatAbout, arguments, connectionId, token);
            }
            else
            {
                await NoStreamingResponseToClient(sessionId, id, whatAbout, arguments, connectionId, token);
            }
        }

        public async Task GetCoachAsync(string whatAbout, Dictionary<string, string> variablesContext, string connectionId, CancellationToken token)
        {
            var arguments = new KernelArguments();

            foreach (var item in variablesContext)
            {
                arguments[item.Key] = item.Value;
            }

            await StreamResponseCoachToClient(whatAbout, arguments, connectionId, token);
        }

        private async Task<MessageResponse> StreamResponseCoachToClient(string whatAbout, KernelArguments arguments, string connectionId, CancellationToken token)
        {

            MessageResponse messageResponse = new MessageResponse
            {
                Content = string.Empty,                
            };

            await foreach (StreamingChatMessageContent contentPiece in _kernel.InvokeStreamingAsync<StreamingChatMessageContent>(_kernel.Plugins[this.PluginName][this.FunctionName], arguments, token))
            {
                if (!string.IsNullOrEmpty(contentPiece.Content))
                {
                    messageResponse.Content += contentPiece.Content;
                    await this.UpdateMessageOnClient("InProgressMessageUpdate", messageResponse, connectionId, token);
                    Console.Write(contentPiece.Content);
                    //await Task.Delay(DELAY);
                }
            }

            await this.UpdateMessageOnClient("EndMessageUpdate", messageResponse, connectionId, token);
            return messageResponse;
        }

        private async Task StreamResponseToClient(string sessionId, string id, string whatAbout, KernelArguments arguments, string connectionId, CancellationToken token)
        {

            MessageResponse messageResponse = new MessageResponse
            {  
                Content = "",               
            };

            await foreach (StreamingChatMessageContent contentPiece in _kernel.InvokeStreamingAsync<StreamingChatMessageContent>(_kernel.Plugins[this.PluginName][this.FunctionName], arguments, token))
            {
                if (!string.IsNullOrEmpty(contentPiece.Content))
                {
                    messageResponse.Content += contentPiece.Content;
                    await this.UpdateMessageOnClient(whatAbout, messageResponse, connectionId, token);
                    Console.Write(contentPiece.Content);
                    await Task.Delay(DELAY);
                }
            }
            

            string NewId = Guid.NewGuid().ToString();
            //Save content in DB
            await this._dashboardRepository.UpsertAsync(new DashboardItem { 
                SessionId = sessionId,
                Content = messageResponse.Content,
                Id = id != null && id != "" ? id : NewId,
                InfoType = whatAbout
            });
            
            await this.UpdateMessageOnClient(whatAbout, messageResponse, connectionId, token);
            
        }

        private async Task NoStreamingResponseToClient(string sessionId, string id, string whatAbout, KernelArguments arguments, string connectionId, CancellationToken token)
        {
            var response = await _kernel.InvokeAsync(_kernel.Plugins[this.PluginName][this.FunctionName], arguments, token);
                        
            string content = response.GetValue<string>()!;

            string NewId = Guid.NewGuid().ToString();
            //Save content in DB
            await this._dashboardRepository.UpsertAsync(new DashboardItem
            {
                SessionId = sessionId,
                Content = content,
                Id = id != null && id != "" ? id : NewId,
                InfoType = whatAbout
            });

            Console.Write(content);

            await SendIconActivationMessage(whatAbout, connectionId , token);
        }

        private async Task SendIconActivationMessage(string whatAbout, string connectionId, CancellationToken token)
        {
            string hubConnection = whatAbout.ToLower() switch
            {
                "summary" => "ActivateNoteIcon",
                "keywords" => "ActivateTagIcon",
                "products" => "ActivateBoxIcon",
                "advice" => "ActivateBotIcon",
                _ => ""
            };

            await this.UpdateMessageOnClient(hubConnection, new MessageResponse(), connectionId, token);
        }

        /// <summary>
        /// Update the response on the client.
        /// </summary>
        /// <param name="message">The message</param>
        private async Task UpdateMessageOnClient(string hubconnection, MessageResponse message, string connectionId, CancellationToken token)
        {
            if (!string.IsNullOrEmpty(connectionId))
            {
                await this._messageRelayHubContext.Clients.Client(connectionId).SendAsync(hubconnection, message, token);
            }
            
        }

    }
}
