using Microsoft.AspNetCore.Mvc;
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

        public IResult GetSummarize(string chatId,string id,  string conversation, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Summarize";

            Task.Run(() => _dashboardResponse.GetAsync(chatId, id, "Summary",
                               new Dictionary<string, string>()
                               {
                    { "conversation", conversation }
            }, token), token);

            return TypedResults.Ok("Summarize requested");
        }

        //return products
        public IResult GetProducts(string chatId, string id, string conversation, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Products";

            Task.Run(() => _dashboardResponse.GetAsync(chatId, id, "Products",
                new Dictionary<string, string>()
                {
                    { "conversation", conversation }
                }
                , token), token);

            return TypedResults.Ok("Products requested");
        }

        //Get Keywords
        public IResult GetKeywords(string chatId, string id, string conversation, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Keywords";

            Task.Run(() => _dashboardResponse.GetAsync(chatId, id, "Keywords",
                new Dictionary<string, string>()
                {
                    { "conversation", conversation }
                }, token), token);

            return TypedResults.Ok("Keywords requested");
        }

        //get advice
        public IResult GetAdvice(string chatId, string id, string conversation, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Advice";

            Task.Run(() => _dashboardResponse.GetAsync(chatId, id, "Advice",
                new Dictionary<string, string>()
                {
                    { "conversation", conversation }
                }, token), token);

            return TypedResults.Ok("Advice requested");
        }

        //for Example
        public IResult GetExample(string chatId, string id, string conversation, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Example";

            Task.Run(() => _dashboardResponse.GetAsync(chatId, id, "Example",
                new Dictionary<string, string>()
                {
                    { "conversation", conversation }
                }, token), token);

            return TypedResults.Ok("Example requested");
        }

        //for evaluation
        public IResult GetEvaluation(string chatId, string id, string conversation, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Evaluation";

            Task.Run(() => _dashboardResponse.GetAsync(chatId, id, "Evaluation",
                new Dictionary<string, string>()
                {
                    { "conversation", conversation }
                }, token), token);

            return TypedResults.Ok("Evaluation requested");
        }

        //return all info from a dashboard
        public async Task<IEnumerable<DashboardItem>> GetDashboard(string chatId)
        {
           return await _dashboardRepository.FindByChatIdAsync(chatId);
        }

        public async Task<string> GetPrompt(string functionName, string plugin)
        {
            string? promptStream = await ReadFunction.Read(Path.Combine(_pluginsDirectory, plugin, functionName),
                FunctionFileType.Prompt);
            return promptStream!;
        }
    }
}
