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
            await Task.Delay(2000);

            return await scenarioService.GetScenariosAsync();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ScenarioItem> Get([FromServices] ScenarioService scenarioService, string id, CancellationToken token)
        {
            return await scenarioService.GetByIdAsync(id, id);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Post([FromServices] ScenarioService scenarioService, [FromBody] ScenarioItem scenario, CancellationToken token)
        {
            scenario.Id = Guid.NewGuid().ToString();
            await scenarioService.AddAsync(scenario);
            return CreatedAtAction(nameof(Get), new { id = scenario.Id }, scenario);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Put([FromServices] ScenarioService scenarioService, string id, [FromBody] ScenarioItem scenario, CancellationToken token)
        {
            if (id != scenario.Id)
            {
                return BadRequest();
            }

            await scenarioService.UpdateAsync(scenario);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete([FromServices] ScenarioService scenarioService, string id, CancellationToken token)
        {
            var scenario = await scenarioService.GetByIdAsync(id, id);
            if (scenario == null)
            {
                return NotFound();
            }

            await scenarioService.DeleteAsync(scenario);
            return NoContent();
        }
    }
}
