using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Azure;
using Azure.AI.DocumentIntelligence;
using System.IO;
using System.Threading.Tasks;
using Microsoft.KernelMemory;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IKernelMemory _kernelMemory;

        public FileUploadController([FromServices] IKernelMemory kernelMemory)
        {
            _kernelMemory = kernelMemory;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            using (var stream = file.OpenReadStream())
            {
                // Call the method to parse the uploaded file stream
                var parseResult = await ParseDocument(stream);

                if (!parseResult)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Error parsing the document.");
                }
            }

            return Ok();
        }

        private async Task<bool> ParseDocument(Stream fileStream)
        {
            string endpoint = "https://virtualteachdocint.cognitiveservices.azure.com/";
            string key = "7bANKH6Dm7ZIqfrXl4dd3AwUYaQq8TkTrumeJbL4fXXV5bcy8NQhJQQJ99ALAC5RqLJXJ3w3AAALACOGGNQ4";

            var client = new DocumentIntelligenceClient(new Uri(endpoint), new AzureKeyCredential(key));

            var binaryData = BinaryData.FromStream(fileStream);
            var content = new AnalyzeDocumentContent() { Base64Source = binaryData };

            int i = 1;

            while (true)
            {
                try
                {
                    Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-layout", content, outputContentFormat: ContentFormat.Markdown, pages: i.ToString());
                    AnalyzeResult result = operation.Value;

                    Console.WriteLine(result.Content);

                    await _kernelMemory.DeleteDocumentAsync(i.ToString(), index: "test");
                    await _kernelMemory.ImportTextAsync(result.Content, i.ToString(), index: "test");
                    i++;
                }
                catch (Exception)
                {
                    break;
                }
            }

            return true;
        }
    }
}
