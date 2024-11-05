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

        [HttpGet("ByType",Name = "{type}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<AgentItem>> GetbyType(string type)
        {
            return await _agentRepository.FindByTypeAsync(type);
        }

        //function Get by Id
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<AgentItem>> Get(string id, string type)
        {
            var agent = await _agentRepository.GetAsync(id, type);
            if (agent == null)
            {
                return NotFound();
            }
            return agent;
        }

       
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AgentItem>> Post([FromBody] AgentItem agent)
        {
            if (agent == null)
            {
                return BadRequest("Agent item is null.");
            }

            agent.Id = Guid.NewGuid().ToString();
            await _agentRepository.AddAsync(agent);
            return CreatedAtAction(nameof(Get), agent.Type);
        }


    }
}
