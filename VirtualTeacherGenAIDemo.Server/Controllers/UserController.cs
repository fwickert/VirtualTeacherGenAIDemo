using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        //getUser
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserItem>> Get(string id)
        {
            var user = await _userService.GetUserAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        //add user
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserItem>> Post([FromBody] UserItem user)
        {
            if (user == null)
            {
                return BadRequest();
            }

            //Check if user already exists
            var existingUser = await _userService.GetUserAsync(user.Id);
            if (existingUser == null)
            {
                await _userService.AddUserAsync(user);
            }                        
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        //update user
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserItem>> Put(string id, [FromBody] UserItem user)
        {
            if (user == null || user.Id != id)
            {
                return BadRequest();
            }
            var existingUser = await _userService.GetUserAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            await _userService.UpdateUserAsync(user);
            return NoContent();
        }
    }
}
