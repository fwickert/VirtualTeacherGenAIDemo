using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly AgentRepository _agentRepository;

        public AgentController(AgentRepository agentRepository)
        {
            _agentRepository = agentRepository;
        }

        [HttpGet("{type}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<AgentItem>> Get(string type)
        {
            return await _agentRepository.FindByTypeAsync(type);
        }


    }
}
