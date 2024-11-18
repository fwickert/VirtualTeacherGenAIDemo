using Microsoft.AspNetCore.Mvc;
using VirtualTeacherGenAIDemo.Server.Models.Storage;
using VirtualTeacherGenAIDemo.Server.Storage;

namespace VirtualTeacherGenAIDemo.Server.Services
{
    public class SessionService
    {
        private readonly SessionRepository _sessionRepository;

        public SessionService([FromServices] SessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }


        public IEnumerable<SessionItem> GetHistory(string userId)
        {
            return _sessionRepository.GetLastHistory(userId);
        }

        public async Task<SessionItem> GetDashboard(string id, string userId)
        {
            return await _sessionRepository.FindByIdAsync(id, userId);
        }

        

        //Update the Session to isCompleted = true
        public async Task CompleteSession(string id, string userId)
        {
            await _sessionRepository.CompleteSession(id, userId);

        }

        //return 1 session by id
        public async Task<SessionItem> GetSession(string id, string userId)
        {
            return await _sessionRepository.FindByIdAsync(id, userId);
        }

        //return all no completed session
        public IEnumerable<SessionItem> GetNotCompletedSession(string userId)
        {
            return _sessionRepository.GetNotCompleteSession(userId);
        }
    }
}
