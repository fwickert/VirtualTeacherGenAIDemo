using Microsoft.SemanticKernel;
using System.ComponentModel;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Tools
{
    public class SearchTool
    {

        private readonly SearchService _searchService;

        public SearchTool(SearchService searchService)
        {
            _searchService = searchService;
        }


        [KernelFunction,
            Description("Use this Tool to search the knowledge and it to help AI to answer accuratly, if it necessary. It could be material of a new collection for the client roleplay, or material for the teacher")]
        public async Task<string> SearchByAgent([Description("The prompt of the user. Rewrite the user prompt to search information accuratly")] string query, 
            [Description("the agent id that is on the system prompt")] string agentId)
        {
            return await _searchService.SearchByAgent(query, agentId, "Knowledge");
        }
    }
}
