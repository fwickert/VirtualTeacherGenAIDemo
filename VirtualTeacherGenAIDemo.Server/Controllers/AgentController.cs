using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly AgentService _agentService;

        public AgentController(AgentService agentService)
        {
            _agentService = agentService;
        }

        [HttpGet("ByType", Name = "{type}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<AgentItem>> GetbyType(string type)
        {
            return await _agentService.GetByTypeAsync(type);
        }

        //function Get by Id
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<AgentItem>> Get(string id, string type)
        {
            var agent = await _agentService.GetByIdAsync(id, type);
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
            await _agentService.AddAgentAsync(agent);
            return CreatedAtAction(nameof(Get), new { id = agent.Id, type = agent.Type }, agent);
        }
    }
}
