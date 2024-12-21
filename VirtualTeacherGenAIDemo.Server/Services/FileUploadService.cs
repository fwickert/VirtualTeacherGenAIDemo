using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Options;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class FileUploadService
    {

        private readonly IKernelMemory _kernelMemory;
        private readonly DocumentIntelligentOptions _options;
        private readonly IHubContext<MessageRelayHub> _messageRelayHubContext;
        private readonly AgentService _agentService;



        public FileUploadService(IKernelMemory kernelMemory,
            IOptions<DocumentIntelligentOptions> options,
            IHubContext<MessageRelayHub> messageRelayHubContext,
            AgentService agentService)
        {
            
            _kernelMemory = kernelMemory;
            _options = options.Value;
            _messageRelayHubContext = messageRelayHubContext;
            _agentService = agentService;
            
        }

        public async Task<bool> DeleteFileInformation(string fileName, string agentId, string type, string connectionId, CancellationToken token)
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

            while (result.Results.Count > 0)
            {
                bool end = false;
                foreach (Citation item in result.Results)
                {
                    foreach (var part in item.Partitions)
                    {
                        var otherAgentIds = part.Tags["agentId"].Where(tag => tag != agentId).ToList();
                        if (otherAgentIds.Any()) //not delete if another agent use this file
                        {   
                            List<string?> tagsToKeep = part.Tags["agentId"].Where(x => x != agentId).ToList();
                            TagCollection tags = new TagCollection();
                            tags.Add("agentId", tagsToKeep);
                            tags.Add("docName", fileName);

                            await _kernelMemory.DeleteDocumentAsync(item.DocumentId, index: _options.IndexName); //need to delete before recreate otherwise new document will be created
                            await _kernelMemory.ImportTextAsync(part.Text, item.DocumentId, tags, index: _options.IndexName);
                        }
                        else
                        {
                            await _kernelMemory.DeleteDocumentAsync(item.DocumentId, index: _options.IndexName);
                            end = true;
                            break;
                        }                       
                    }
                     if(end)
                        {
                            break;
                        }

                }
                // Assuming you need to re-fetch the results after deletion
                result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter);
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

        //Delete indesearch by docname
        public async Task<bool> DeleteFileInformationByDocName(string docName)
        {
            MemoryFilter filter = new MemoryFilter();
            filter.Add("docName", docName);

            SearchResult result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter: filter);
            while (result.Results.Count > 0)
            {
                foreach (Citation item in result.Results)
                {
                    await _kernelMemory.DeleteDocumentAsync(item.DocumentId, index: _options.IndexName);
                }
                result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter);
            }

            return (true);

        }


        private async Task UpdateMessageOnClient(string hubConnection, object message, string connectionId, CancellationToken token)
        {
            await _messageRelayHubContext.Clients.Client(connectionId).SendAsync(hubConnection, message, token);
        }
    }
}
