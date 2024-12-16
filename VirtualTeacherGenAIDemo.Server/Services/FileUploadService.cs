using Azure;
using Azure.AI.DocumentIntelligence;
using DocumentFormat.OpenXml.Wordprocessing;
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
        private readonly AgentService _agentService;

        public FileUploadService(IKernelMemory kernelMemory, IOptions<DocumentIntelligentOptions> options, IHubContext<MessageRelayHub> messageRelayHubContext, AgentService agentService)
        {
            _kernelMemory = kernelMemory;
            _options = options.Value;
            _messageRelayHubContext = messageRelayHubContext;
            _agentService = agentService;
        }

        public async Task<bool> ParseDocument(Stream fileStream, string fileName, string agentId, string type, string connectionId, CancellationToken token)
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
                    tags.Add("docName", fileName);


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

            //Update agent with filename
            //Get agent to update
            
            var agent = await _agentService.GetByIdAsync(agentId, type);
            if (agent != null)
            {
                //Check the file name is not already in the list
                if (!agent.FileNames.Contains(fileName))
                {
                    agent.FileNames.Add(fileName);
                    await _agentService.UpdateAgentAsync(agent);
                }
            }


            return true;
        }

        public async Task<bool> DeleteFileInformation(string fileName, string agentId, string type,  string connectionId,  CancellationToken token)
        {
            var agent = await _agentService.GetByIdAsync(agentId, type);
            if (agent == null)
            {
                return false;
            }

            MemoryFilter filter = new MemoryFilter();
            filter.Add("agentId", agentId);
            filter.Add("docName", fileName);


            SearchResult result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter);

            await UpdateMessageOnClient("DeleteFileUpdate", "Delete file started...", connectionId, token);

            foreach (var item in result.Results) {
                await _kernelMemory.DeleteDocumentAsync(item.DocumentId,index:_options.IndexName);
            }
            

            // Remove file name from agent's file list
            if (agent.FileNames.Contains(fileName))
            {
                agent.FileNames.Remove(fileName);
                await _agentService.UpdateAgentAsync(agent);
            }
            await UpdateMessageOnClient("DeleteFileUpdate", "Delete file completed !", connectionId, token);
            return true;
        }

        private async Task UpdateMessageOnClient(string hubConnection, object message, string connectionId, CancellationToken token)
        {
            await _messageRelayHubContext.Clients.Client(connectionId).SendAsync(hubConnection, message, token);
        }
    }
}
