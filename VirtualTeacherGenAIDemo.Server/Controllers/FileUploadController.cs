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
        private readonly DocumentService _documentService;

        public FileUploadController([FromServices] FileUploadService fileUploadService, DocumentService documentService)
        {
            _fileUploadService = fileUploadService;
            _documentService = documentService;
        }

        [HttpPost()]
        public async Task<IActionResult> UploadFile(string connectionId, string agentId, string type, IFormFile file, [FromForm] string fileName, [FromForm] string fileId, [FromForm] int chunkIndex, [FromForm] int totalChunks, CancellationToken token)
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
                _ = Task.Run(() => _documentService.ParseDocument(fileStream, fileName , agentId, type ,connectionId, token));
                _fileStreams.TryRemove(fileId, out _);
            }

            return Ok();
        }

        //Add delete
        [HttpDelete]
        public async Task<IActionResult> DeleteFile(string connectionId, string agentId, string filename, string type, CancellationToken token)
        {
            _ = Task.Run(() => _fileUploadService.DeleteFileInformation(filename, agentId, type, connectionId, token));

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> DeleteFile(string filename)
        {
            await _fileUploadService.DeleteFileInformationByDocName(filename);

            return Ok();
        }

    }
}
