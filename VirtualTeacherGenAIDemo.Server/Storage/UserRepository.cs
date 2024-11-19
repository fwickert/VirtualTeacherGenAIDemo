using VirtualTeacherGenAIDemo.Server.Models.Storage;

namespace VirtualTeacherGenAIDemo.Server.Storage
{
    public class UserRepository : Repository<UserItem>
    {
        public UserRepository(IStorageContext<UserItem> context) : base(context)
        {
        }

        public async Task<UserItem?> GetUserAsync(string id)
        {
            

            try
            {
                UserItem user = await base.StorageContext.ReadAsync(id, id);
                return user;
            }
            catch (KeyNotFoundException)
            {

                return null;
            }

            
        }


        public Task AddUserAsync(UserItem user)
        {
            return base.StorageContext.CreateAsync(user);
        }

        public Task UpdateUserAsync(UserItem user)
        {
            return base.StorageContext.UpsertAsync(user);
        }

        public Task DeleteUserAsync(UserItem user)
        {
            return base.StorageContext.DeleteAsync(user);
        }
    }
}
