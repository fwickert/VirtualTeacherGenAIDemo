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
        private readonly ConcurrentDictionary<string, ConcurrentDictionary<int, byte[]>> _fileChunks = new();

        public FileUploadController([FromServices] FileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost("")]
        public async Task<IActionResult> UploadFile(string connectionId, IFormFile fileStream, int chunkIndex, int totalChunks, CancellationToken token)
        {
            if (fileStream == null || fileStream.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            if (!_fileChunks.ContainsKey(connectionId))
            {
                _fileChunks[connectionId] = new ConcurrentDictionary<int, byte[]>();
            }

            using (var memoryStream = new MemoryStream())
            {
                await fileStream.CopyToAsync(memoryStream, token);
                _fileChunks[connectionId][chunkIndex] = memoryStream.ToArray();
            }

            if (_fileChunks[connectionId].Count == totalChunks)
            {
                // All chunks uploaded, assemble the file
                using (var finalMemoryStream = new MemoryStream())
                {
                    for (int i = 0; i < totalChunks; i++)
                    {
                        if (_fileChunks[connectionId].TryGetValue(i, out var chunk))
                        {
                            await finalMemoryStream.WriteAsync(chunk, 0, chunk.Length, token);
                        }
                        else
                        {
                            return NoContent(); // Missing chunk
                        }
                    }

                    finalMemoryStream.Position = 0;
                    var parseResult = await _fileUploadService.ParseDocument(finalMemoryStream, connectionId, token);
                    if (!parseResult)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Error parsing the document.");
                    }
                }

                _fileChunks.TryRemove(connectionId, out _); // Clean up chunks
            }

            return Ok();
        }
    }
}
