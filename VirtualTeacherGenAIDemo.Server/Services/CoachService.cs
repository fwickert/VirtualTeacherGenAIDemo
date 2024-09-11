using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using VirtualTeacherGenAIDemo.Server.Utilities;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class CoachService
    {
        private readonly LLMResponse _coachResponse;
        

        public CoachService([FromServices] LLMResponse coachResponse)
        {
            _coachResponse = coachResponse;
            _coachResponse.PluginName = "CoachPlugin";
           
        }

        public IResult GetQuestions(string subject, int number, string connectionId, CancellationToken token)
        {
            _coachResponse.FunctionName = "Question";
            Task.Run(() => _coachResponse.GetCoachAsync("Questions",
                new Dictionary<string, string>()
                {
                    { "subject", subject},
                    { "number", number.ToString()
                }
           }, connectionId, token), token);

            return TypedResults.Ok("Questions requested");
        }
       
        //return product category
        public IResult GetProductCategory(string phrase, string connectionId, CancellationToken token)
        {
            _coachResponse.FunctionName = "Product";
            Task.Run(() => _coachResponse.GetCoachAsync("ProductCategory",
                    new Dictionary<string, string>()
                    {
                    { "phrase", phrase}
                }, connectionId, token), token);

            return TypedResults.Ok("Product catageory requested");
        }
    }
}
