using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;
using VirtualTeacherGenAIDemo.Server.Utilities;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class DashboardService
    {
        private readonly LLMResponse _dashboardResponse;
        private readonly DashboardRepository _dashboardRepository;
        private readonly string _pluginsDirectory;

        public DashboardService([FromServices] LLMResponse dashboardResponse, [FromServices] DashboardRepository dashboardRepository)
        {
            _dashboardResponse = dashboardResponse;
            _dashboardRepository = dashboardRepository;
            _dashboardResponse.PluginName = "DashboardPlugin";
            _pluginsDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Plugins");
        }

        public IResult GetSummarize(DashboardRequest dashboardRequest, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Summary";

            Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.ChatId, dashboardRequest.Id, "Summary",
                               new Dictionary<string, string>()
                               {
                    { "conversation", dashboardRequest.Conversation }
            }, dashboardRequest.ConnectionId, token), token);

            return TypedResults.Ok("Summarize requested");
        }

        //return products
        public IResult GetProducts(DashboardRequest dashboardRequest, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Products";

            Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.ChatId, dashboardRequest.Id, "Products",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation }
                }
                , dashboardRequest.ConnectionId, token), token);

            return TypedResults.Ok("Products requested");
        }

        //Get Keywords
        public IResult GetKeywords(DashboardRequest dashboardRequest, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Keywords";

            Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.ChatId, dashboardRequest.Id, "Keywords",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation }
                }, dashboardRequest.ConnectionId, token), token);

            return TypedResults.Ok("Keywords requested");
        }

        //get advice
        public IResult GetAdvice(DashboardRequest dashboardRequest, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Advice";

            Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.ChatId, dashboardRequest.Id, "Advice",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation }
                }, dashboardRequest.ConnectionId, token), token);

            return TypedResults.Ok("Advice requested");
        }

        //for Example
        public IResult GetExample(DashboardRequest dashboardRequest, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Example";

            Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.ChatId, dashboardRequest.Id, "Example",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation }
                }, dashboardRequest.ConnectionId, token), token);

            return TypedResults.Ok("Example requested");
        }

        //for evaluation
        public IResult GetEvaluation(DashboardRequest dashboardRequest, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Evaluation";

            Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.ChatId, dashboardRequest.Id, "Evaluation",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation }
                }, dashboardRequest.ConnectionId, token), token);

            return TypedResults.Ok("Evaluation requested");
        }

        //return all info from a dashboard
        public async Task<IEnumerable<DashboardItem>> GetDashboard(string chatId)
        {
            return await _dashboardRepository.FindByChatIdAsync(chatId);
        }

        public async Task<string> GetPrompt(string functionName, string plugin)
        {
            if (functionName.Contains("..") || functionName.Contains("/") || functionName.Contains("\\") ||
                plugin.Contains("..") || plugin.Contains("/") || plugin.Contains("\\"))
            {
                throw new ArgumentException("Invalid functionName or plugin");
            }

            string? promptStream = await ReadFunction.Read(Path.Combine(_pluginsDirectory, plugin, functionName),
                FunctionFileType.Prompt);
            return promptStream!;
        }
    }
}
