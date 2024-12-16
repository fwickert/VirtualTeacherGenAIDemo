using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using MongoDB.Driver.Core.Connections;
using System;
using System.IO;
using System.Threading.Tasks;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Options;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class FileUploadService
    {
        private readonly IKernelMemory _kernelMemory;
        private readonly DocumentIntelligentOptions _options;
        private readonly IHubContext<MessageRelayHub> _messageRelayHubContext;

        public FileUploadService(IKernelMemory kernelMemory, IOptions<DocumentIntelligentOptions> options, IHubContext<MessageRelayHub> messageRelayHubContext)
        {
            _kernelMemory = kernelMemory;
            _options = options.Value;
            _messageRelayHubContext = messageRelayHubContext;
        }

        public async Task<bool> ParseDocument(Stream fileStream, string fileName, string agentId, string connectionId, CancellationToken token)
        {
            var client = new DocumentIntelligenceClient(new Uri(_options.Endpoint), new AzureKeyCredential(_options.Key));

            var binaryData = BinaryData.FromStream(fileStream);
            var content = new AnalyzeDocumentContent() { Base64Source = binaryData };

            int i = 1;
            await UpdateMessageOnClient("DocumentParsedUpdate", "Process started...", connectionId, token);
            while (true)
            {
                try
                {
                    Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-layout", content, outputContentFormat: ContentFormat.Markdown, pages: i.ToString());
                    AnalyzeResult result = operation.Value;

                    TagCollection tags = new TagCollection();
                    tags.Add("agentId", agentId);

                    string docuId = $"{agentId}_file_{fileName.Replace(" ", "-")}_id_{i.ToString()}";                    

                    if (!string.IsNullOrWhiteSpace(result.Content))
                    {
                        //await _kernelMemory.DeleteDocumentAsync(docuId, index: _options.IndexName); // Need to test if need to delete
                        await _kernelMemory.ImportTextAsync(result.Content, docuId, index: _options.IndexName, tags: tags);

                        string toSend = $"Page {i} parsed successfully.";
                        await UpdateMessageOnClient("DocumentParsedUpdate", toSend, connectionId, token);
                    }
                    
                    i++;
                }
                catch (Exception ex)
                {
                    await UpdateMessageOnClient("DocumentParsedUpdate", $"Error : {ex.Message}", connectionId, token);
                    break;
                }
            }
            await UpdateMessageOnClient("DocumentParsedUpdate", "Process completed !", connectionId, token);

            return true;
        }

        private async Task UpdateMessageOnClient(string hubConnection, object message, string connectionId, CancellationToken token)
        {
            await _messageRelayHubContext.Clients.Client(connectionId).SendAsync(hubConnection, message, token);
        }
    }
}
