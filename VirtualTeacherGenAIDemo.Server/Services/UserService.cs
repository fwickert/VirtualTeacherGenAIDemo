using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;
        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<UserItem?> GetUserAsync(string id)
        {
            return await _userRepository.GetUserAsync(id);
        }
        public async Task AddUserAsync(UserItem user)
        {

            await _userRepository.AddUserAsync(user);


        }
        public async Task UpdateUserAsync(UserItem user)
        {
            await _userRepository.UpdateUserAsync(user);
        }
        public async Task DeleteUserAsync(UserItem user)
        {
            await _userRepository.DeleteUserAsync(user);
        }
    }
}
