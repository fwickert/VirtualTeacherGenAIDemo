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
            Description("Use this Tool to search the knowledge and it to help AI to answer accuratly. It could be material of a new collection, material for the teacher")]
        public async Task<string> SearchByAgent([Description("The prompt of the user")] string query, 
            [Description("the agent id that is on the system prompt")] string agentId)
        {
            return await _searchService.SearchByAgent(query, agentId, "Knowledge");
        }
    }
}
