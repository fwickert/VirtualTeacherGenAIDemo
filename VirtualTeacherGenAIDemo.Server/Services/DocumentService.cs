using Azure.AI.DocumentIntelligence;
using Azure;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using VirtualTeacherGenAIDemo.Server.Hubs;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Options;
using VirtualTeacherGenAIDemo.Server.Services;

public class DocumentService
{
    private readonly IKernelMemory _kernelMemory;
    private readonly DocumentIntelligentOptions _options;
    private readonly IHubContext<MessageRelayHub> _messageRelayHubContext;
    private readonly AgentService _agentService;
    private readonly SearchService _searchService;

    public DocumentService(IKernelMemory kernelMemory,
        IOptions<DocumentIntelligentOptions> options,
        IHubContext<MessageRelayHub> messageRelayHubContext,
        AgentService agentService,
        SearchService searchService)
    {
        _kernelMemory = kernelMemory;
        _options = options.Value;
        _messageRelayHubContext = messageRelayHubContext;
        _agentService = agentService;
        _searchService = searchService;
    }

    public async Task<bool> ParseDocument(Stream fileStream, string fileName, string agentId, string type, string connectionId, CancellationToken token)
    {
        var client = new DocumentIntelligenceClient(new Uri(_options.Endpoint), new AzureKeyCredential(_options.Key));
        var binaryData = BinaryData.FromStream(fileStream);
        var content = new AnalyzeDocumentContent() { Base64Source = binaryData };

        await UpdateMessageOnClient("DocumentParsedUpdate", "Process started...", connectionId, token);

        var agent = await GetOrCreateAgentAsync(agentId, type, fileName);
        var agentIds = await GetAgentIdsByFileNameAsync(fileName);

        int pageIndex = 1;
        while (true)
        {
            try
            {
                var docuId = GenerateDocumentId(fileName, pageIndex);
                var searchResults = await _searchService.SearchByDocId(docuId);

                if (searchResults.Count == 0)
                {
                    var result = await AnalyzeDocumentAsync(client, content, pageIndex);
                    if (result != null)
                    {
                        await ImportDocumentContentAsync(result.Content, docuId, agentIds, fileName);
                        if (!fileName.EndsWith("pdf") && result.Pages.Count == pageIndex)
                        {
                            break;
                        }
                    }
                }
                else
                {
                    await ReimportExistingDocumentsAsync(searchResults, docuId, agentIds, fileName);
                }

                await UpdateMessageOnClient("DocumentParsedUpdate", $"Page {pageIndex} parsed successfully.", connectionId, token);
                pageIndex++;
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



    public async Task UpdateDocumentsWithNewAgentIdAsync(string originalAgentId, string newAgentId)
    {
        MemoryFilter filter = new MemoryFilter();
        filter.Add("agentId", originalAgentId);

        SearchResult result = await _kernelMemory.SearchAsync("", index: _options.IndexName, filter);
        

        foreach (Citation item in result.Results)
        {
            foreach (var part in item.Partitions)
            {
                TagCollection tags = new TagCollection();
                var updateTags = part.Tags["agentId"];
                updateTags.Add(newAgentId);
                tags.Add("agentId", updateTags);
                tags.Add("docName", part.Tags["docName"]);

                await _kernelMemory.DeleteDocumentAsync(item.DocumentId, _options.IndexName);
                await _kernelMemory.ImportTextAsync(part.Text, item.DocumentId, tags, _options.IndexName);
            }
        }
    }



    private async Task<AgentItem> GetOrCreateAgentAsync(string agentId, string type, string fileName)
    {
        try
        {
            var agent = await _agentService.GetByIdAsync(agentId, type);
            if (!agent.FileNames.Contains(fileName))
            {
                agent.FileNames.Add(fileName);
                await _agentService.UpdateAgentAsync(agent);
            }
            return agent;
        }
        catch (KeyNotFoundException)
        {
            var agent = new AgentItem
            {
                Id = agentId,
                Type = type,
                FileNames = new List<string> { fileName }
            };
            await _agentService.AddAgentAsync(agent);
            return agent;
        }
    }

    private async Task<List<string>> GetAgentIdsByFileNameAsync(string fileName)
    {
        var items = await _agentService.GetAgentsByFileNameAsync(fileName);
        return items.Select(x => x.Id).ToList();
    }

    private string GenerateDocumentId(string fileName, int pageIndex)
    {
        return $"{fileName.Replace(" ", "-")}_id_{pageIndex}";
    }

    private async Task<AnalyzeResult?> AnalyzeDocumentAsync(DocumentIntelligenceClient client, AnalyzeDocumentContent content, int pageIndex)
    {
        var operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-layout", content, outputContentFormat: ContentFormat.Markdown, pages: pageIndex.ToString());
        return operation.Value;
    }

    private async Task ImportDocumentContentAsync(string content, string docuId, List<string> agentIds, string fileName)
    {
        var tags = new TagCollection
        {
            { "agentId", agentIds },
            { "docName", fileName }
        };
        await _kernelMemory.ImportTextAsync(content, docuId, index: _options.IndexName, tags: tags);
    }

    private async Task ReimportExistingDocumentsAsync(List<string> searchResults, string docuId, List<string?> agentIds, string fileName)
    {
        var tags = new TagCollection
        {
            { "agentId", agentIds },
            { "docName", fileName }
        };

        foreach (var item in searchResults)
        {
            await _kernelMemory.DeleteDocumentAsync(docuId, index: _options.IndexName);
            await _kernelMemory.ImportTextAsync(item, docuId, index: _options.IndexName, tags: tags);
        }
    }

    private async Task UpdateMessageOnClient(string hubConnection, object message, string connectionId, CancellationToken token)
    {
        await _messageRelayHubContext.Clients.Client(connectionId).SendAsync(hubConnection, message, token);
    }
}
