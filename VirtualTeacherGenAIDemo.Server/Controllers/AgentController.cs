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
        public async Task<IEnumerable<AgentItem>> GetAgentsByType(string type, bool withSystem = false)
        {
            if (withSystem)
            {
                return await _agentService.GetAgentsAndSystemAsync(type);
            }

            return await _agentService.GetByTypeAsync(type);
        }

        [HttpGet("All")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<AgentItem>> GetAllAgents()
        {
            return await _agentService.GetAllAgentsAsync();
        }

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
        public async Task<ActionResult<AgentItem>> Post(AgentItem agent)
        {
            if (agent == null)
            {
                return BadRequest("Agent item is null.");
            }

            agent.Id = Guid.NewGuid().ToString();
            
            await _agentService.AddAgentAsync(agent);
            return CreatedAtAction(nameof(Get), new { id = agent.Id, type = agent.Type }, agent);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Put(string id, AgentItem agent)
        {
            if (agent == null || agent.Id != id)
            {
                return BadRequest();
            }

            var agentToUpdate = await _agentService.GetByIdAsync(id, agent.Type);
            if (agentToUpdate == null)
            {
                return NotFound();
            }

            
            await _agentService.UpdateAgentAsync(agent);
            return NoContent();
        }

        [HttpDelete("{agentid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string agentid, string type)
        {
            if (string.IsNullOrWhiteSpace(agentid) || string.IsNullOrWhiteSpace(type))
            {
                return BadRequest("Agent id or type is missing");
            }

            var agentToDelete = await _agentService.GetByIdAsync(agentid, type);
            if (agentToDelete == null)
            {
                return NotFound("Agent not found");
            }

            await _agentService.DeleteAgentAsync(agentToDelete);
            return NoContent();
        }

        private async Task HandleFileUpload(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var filePath = Path.Combine("uploads", file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
        }
    }
}
