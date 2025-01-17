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
        private readonly DocumentService _documentService;
        private readonly ScenarioService _scenarioService;

        public AgentController(AgentService agentService, DocumentService documentService, ScenarioService scenarioService)
        {
            _agentService = agentService;
            _documentService = documentService;
            _scenarioService = scenarioService;
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

        [HttpGet("HasFiles/{agentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> HasFiles(string agentId)
        {
            var hasFiles = await _agentService.AgentHasFilesAsync(agentId);
            if (!hasFiles)
            {
                return NotFound("Agent has no files or does not exist.");
            }
            return hasFiles;
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

            if (string.IsNullOrEmpty(agent.Id))
            {
                agent.Id = Guid.NewGuid().ToString();
            }
            
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

            //Update scenario too, for prompt changed
            var scenarios = await _scenarioService.GetScenariosByAgentIdAsync(agent.Id);
            foreach (var scenario in scenarios)
            {
                foreach (var scenarioAgent in scenario.Agents!)
                {
                    if (scenarioAgent.Id == agent.Id)
                    {
                        scenarioAgent.Prompt = agent.Prompt;
                        scenarioAgent.Name = agent.Name;                        
                        // If the agent is a teacher, update the features' prompt too
                        if (agent.Type == "teacher")
                        {
                            foreach (var feature in scenarioAgent.features)
                            {
                                var matchingFeature = agent.Features.FirstOrDefault(f => f.Feature == feature.Feature);
                                if (matchingFeature != null)
                                {
                                    feature.Prompt = matchingFeature.Prompt;
                                }
                            }
                        }
                    }
                }
                await _scenarioService.UpdateAsync(scenario);
            }

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

        [HttpPost("Clone")]
        public async Task<IActionResult> Clone([FromBody] AgentItem originalAgent)
        {
            if (originalAgent == null)
            {
                return BadRequest("Original agent is null.");
            }

            var newAgent = await _agentService.CloneAgentAsync(originalAgent);
            await _documentService.UpdateDocumentsWithNewAgentIdAsync(originalAgent.Id, newAgent.Id);

            return CreatedAtAction(nameof(Get), new { id = newAgent.Id, type = newAgent.Type }, newAgent);
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
