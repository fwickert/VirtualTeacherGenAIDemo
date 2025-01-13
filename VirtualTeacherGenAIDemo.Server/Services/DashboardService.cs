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
        private readonly SessionRepository _sessionRepository;
        private readonly string _pluginsDirectory;
        private readonly SearchService _searchService;

        public DashboardService([FromServices] LLMResponse dashboardResponse,
            [FromServices] DashboardRepository dashboardRepository,
            [FromServices] SessionRepository sessionRepository,
            [FromServices] SearchService searchService)
        {
            _dashboardResponse = dashboardResponse;
            _dashboardRepository = dashboardRepository;
            _dashboardResponse.PluginName = "DashboardPlugin";
            _pluginsDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Plugins");
            _sessionRepository = sessionRepository;
            _searchService = searchService;
        }

        public async Task<IResult> GetSummarize(DashboardRequest dashboardRequest, string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Summary";

            SessionAgent agentTeacher = await GetAgent(sessionId, userName, "teacher");
            string summaryPrompt = agentTeacher.features.Single(q => q.Feature == "summary").Prompt;

            _ = Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.SessionId, dashboardRequest.Id, "Summary",
                               new Dictionary<string, string>()
                               {
                    { "conversation", dashboardRequest.Conversation },
                    { "task", summaryPrompt }
            }, dashboardRequest.ConnectionId, refreshUI, token), token);

            return TypedResults.Ok("Summarize requested");
        }

        //return products
        public async Task<IResult> GetProducts(DashboardRequest dashboardRequest, string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Products";

            SessionAgent agentTeacher = await GetAgent(sessionId, userName, "teacher");
            string productPrompt = agentTeacher.features.Single(q => q.Feature == "products").Prompt;

            _ = Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.SessionId, dashboardRequest.Id, "Products",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation },
                    { "task", productPrompt }
                }
                , dashboardRequest.ConnectionId, refreshUI, token), token);

            return TypedResults.Ok("Products requested");
        }

        //Get Keywords
        public async Task<IResult> GetKeywords(DashboardRequest dashboardRequest, string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Keywords";

            SessionAgent agentTeacher = await GetAgent(sessionId, userName, "teacher");
            string keywordPrompt = agentTeacher.features.Single(q => q.Feature == "keywords").Prompt;

            _ = Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.SessionId, dashboardRequest.Id, "Keywords",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation },
                    { "task", keywordPrompt }
                }, dashboardRequest.ConnectionId, refreshUI, token), token);

            return TypedResults.Ok("Keywords requested");
        }

        //get advice
        public async Task<IResult> GetAdvice(DashboardRequest dashboardRequest, string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Advice";

            SessionAgent agentTeacher = await GetAgent(sessionId, userName, "teacher");
            SessionAgent agentRolePlay = await GetAgent(sessionId, userName, "rolePlay");

            string advicePrompt = agentTeacher.features.Single(q => q.Feature == "advice").Prompt;

            //take the content of knowledge by searching with agentId
            string search = await _searchService.SearchByAgent("", agentTeacher.Id, "teacher");

            _ = Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.SessionId, dashboardRequest.Id, "Advice",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation },
                    { "userPrompt", agentTeacher.Prompt },
                    {"knowledge", search },
                    { "task", advicePrompt },
                    { "roleplay", agentRolePlay.Name }
                }, dashboardRequest.ConnectionId, refreshUI, token), token);

            return TypedResults.Ok("Advice requested");
        }

        //for Example
        public async Task<IResult> GetExample(DashboardRequest dashboardRequest, string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Example";

            SessionAgent agentTeacher = await GetAgent(sessionId, userName, "teacher");

            _ = Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.SessionId, dashboardRequest.Id, "Example",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation },
                    { "userPrompt", agentTeacher.Prompt }
                }, dashboardRequest.ConnectionId, refreshUI, token), token);

            return TypedResults.Ok("Example requested");
        }

        //for evaluation
        public async Task<IResult> GetEvaluation(DashboardRequest dashboardRequest, string sessionId, string userName, bool refreshUI, CancellationToken token)
        {
            _dashboardResponse.FunctionName = "Evaluation";

            SessionAgent agentTeacher = await GetAgent(sessionId, userName, "teacher");

            //take the content of knowledge by searching with agentId
            string search = await _searchService.SearchByAgent("", agentTeacher.Id, "teacher");

            _ = Task.Run(() => _dashboardResponse.GetAsync(dashboardRequest.SessionId, dashboardRequest.Id, "Evaluation",
                new Dictionary<string, string>()
                {
                    { "conversation", dashboardRequest.Conversation },
                    { "userPrompt", agentTeacher.Prompt },
                    { "knowledge", search }
                }, dashboardRequest.ConnectionId, refreshUI, token), token);

            return TypedResults.Ok("Evaluation requested");
        }

        //return all info from a dashboard
        public async Task<IEnumerable<DashboardItem>> GetDashboard(string sessionId)
        {
            return await _dashboardRepository.FindByChatIdAsync(sessionId);
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

        private async Task<SessionAgent> GetAgent(string sessionId, string userName, string type)
        {
            //take the agent teacher intruction from user for userPrompt properties
            SessionItem session = await _sessionRepository.GetSessionById(sessionId, userName);
            SessionAgent? agent = session.Agents.Single(q => q.Type == type);
            return agent;
        }
    }
}
