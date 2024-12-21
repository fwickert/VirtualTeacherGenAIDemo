using Microsoft.Extensions.Options;
using Microsoft.KernelMemory;
using System.Text;
using VirtualTeacherGenAIDemo.Server.Options;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class SearchService
    {

        private IKernelMemory _memoryServerless;
        private readonly DocumentIntelligentOptions _documentIntelligentOptions;

        public SearchService(IKernelMemory memoryServerless, IOptions<DocumentIntelligentOptions> options)
        {
            _memoryServerless = memoryServerless;
            _documentIntelligentOptions = options.Value;
        }


        public async Task<string> SearchByAgent(string query, string agentId, string type)
        {
            MemoryFilter filter = new MemoryFilter();

            filter.Add("agentId", agentId);

            StringBuilder results = new();

            results.AppendLine();
            results.AppendLine($"[{type.ToUpper()}]");
            results.AppendLine();

            SearchResult answer = await _memoryServerless.SearchAsync(query: query, index: _documentIntelligentOptions.IndexName, filter: filter);

            foreach (Citation result in answer.Results)
            {
                foreach (var part in result.Partitions.OrderBy(o => o.Relevance))
                {
                    results.AppendLine(part.Text);
                    results.AppendLine($"Relevance: {part.Relevance}");
                }

            }

            return results.ToString();
        }

        //Search by docId
        public async Task<List<string>> SearchByDocId(string docId)
        {
            MemoryFilter filter = new MemoryFilter();
            filter.Add("__document_id", docId);
            List<string> results = new();
            
            SearchResult answer = await _memoryServerless.SearchAsync(query: "", index: _documentIntelligentOptions.IndexName, filter: filter);
            foreach (Citation result in answer.Results)
            {
                foreach (var part in result.Partitions.OrderBy(o => o.Relevance))
                {
                    results.Add(part.Text);                    
                }
            }
            return results;
        }

        public async Task<string> TestSearchWithArray(string agentId)
        {
            MemoryFilter filter = new MemoryFilter();
            
            List<string> agentIds = new();
            agentIds.Add(agentId);

            filter.Add("agentId", agentIds!);

            StringBuilder results = new();
            results.AppendLine();
            SearchResult answer = await _memoryServerless.SearchAsync(query: "test", index: _documentIntelligentOptions.IndexName, filter: filter);
            foreach (Citation result in answer.Results)
            {
                foreach (var part in result.Partitions.OrderBy(o => o.Relevance))
                {
                    results.AppendLine(part.Text);
                    results.AppendLine($"Relevance: {part.Relevance}");
                }
            }
            return results.ToString();



        }
    }
}
