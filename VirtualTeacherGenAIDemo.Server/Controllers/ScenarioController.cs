using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScenarioController : ControllerBase
    {
        [HttpGet()]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IEnumerable<ScenarioItem>> Get([FromServices] ScenarioService scenarioService, CancellationToken token)
        {
            return await scenarioService.GetScenariosAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ScenarioItem> Get([FromServices] ScenarioService scenarioService, string id, CancellationToken token)
        {
            return await scenarioService.GetByIdAsync(id, id);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Post([FromServices] ScenarioService scenarioService, [FromBody] ScenarioItem scenario, CancellationToken token)
        {
            scenario.Id = Guid.NewGuid().ToString();
            await scenarioService.AddAsync(scenario);
            return CreatedAtAction(nameof(Get), new { id = scenario.Id }, scenario);
        }
    }
}
