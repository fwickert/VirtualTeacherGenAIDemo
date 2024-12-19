using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.KernelMemory;
using StackExchange.Redis;
using VirtualTeacherGenAIDemo.Server.Services;

namespace VirtualTeacherGenAIDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestParseDocument : ControllerBase
    {
        private IKernelMemory _kernelMemory;
        private readonly SearchService _searchService;

        public TestParseDocument([FromServices] IKernelMemory kernelMemory, SearchService searchService)
        {
            _kernelMemory = kernelMemory;
            _searchService = searchService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            string endpoint = "https://virtualteachdocint.cognitiveservices.azure.com/";
            string key = "7bANKH6Dm7ZIqfrXl4dd3AwUYaQq8TkTrumeJbL4fXXV5bcy8NQhJQQJ99ALAC5RqLJXJ3w3AAALACOGGNQ4";

            var client = new DocumentIntelligenceClient(new Uri(endpoint), new AzureKeyCredential(key));

            string filePath = @"D:\temp\chanel\page 7.pdf";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found");
            }


            using (var stream = System.IO.File.OpenRead(filePath))
            {
                var binaryData = BinaryData.FromStream(stream);

                var content = new AnalyzeDocumentContent() { Base64Source = binaryData };


                int i = 1;

                while (true)
                {
                    try
                    {
                        Operation<AnalyzeResult> operation = await client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-layout", content, outputContentFormat: ContentFormat.Markdown,
                        pages: i.ToString());


                        AnalyzeResult result = operation.Value;

                        Console.WriteLine(result.Content);

                        await _kernelMemory.DeleteDocumentAsync(i.ToString(), index: "test");

                        //Add tag with the agent ID => Thanif I search with agent I can filter by his id.
                        await _kernelMemory.ImportTextAsync(result.Content, i.ToString(), index: "test");
                        i++;
                    }
                    catch (Exception ex)
                    {                        
                        break;
                    }


                }


                
                //DocumentUploadRequest documentUploadRequest = new DocumentUploadRequest();
                //documentUploadRequest.Files.Add(new DocumentUploadRequest.UploadedFile()
                //{
                //    FileContent = stream,
                //    FileName = "page 7.pdf"
                //});
                //documentUploadRequest.DocumentId = "page 7.pdf";
                //documentUploadRequest.Steps.Add("");



                //var docIntOcrEngine = await _kernelMemory.ImportDocumentAsync(documentUploadRequest);

                
            }

            return Ok();
        }

        //call Searchservice and Test method
        [HttpGet("search")]
        public async Task<IActionResult> Search()
        {

            var result = await _searchService.TestSearchWithArray("a91e75cc-6841-4a0d-a379-eff7a7a61281");
            return Ok(result);
        }

        

    }
}
