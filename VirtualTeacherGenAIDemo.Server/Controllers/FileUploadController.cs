using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly FileUploadService _fileUploadService;
        private static readonly ConcurrentDictionary<string, MemoryStream> _fileStreams = new();

        public FileUploadController([FromServices] FileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost()]
        public async Task<IActionResult> UploadFile(string connectionId, string agentId, IFormFile file, [FromForm] string fileName, [FromForm] string fileId, [FromForm] int chunkIndex, [FromForm] int totalChunks, CancellationToken token)
        {
            if (!_fileStreams.ContainsKey(fileId))
            {
                _fileStreams[fileId] = new MemoryStream();
            }

            var fileStream = _fileStreams[fileId];
            await file.CopyToAsync(fileStream, token);

            if (chunkIndex == totalChunks - 1)
            {
                fileStream.Position = 0;
                _ = Task.Run(() => _fileUploadService.ParseDocument(fileStream, fileName , agentId, connectionId, token));
                _fileStreams.TryRemove(fileId, out _);
            }

            return Ok();
        }
    }
}
