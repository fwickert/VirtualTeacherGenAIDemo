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
                foreach(var part in result.Partitions.OrderBy(o=>o.Relevance))
                {
                    results.AppendLine(part.Text);
                    results.AppendLine($"Relevance: {part.Relevance}");
                }
                
            }

            return results.ToString(); 
        }

    }
}
