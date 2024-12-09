using Microsoft.KernelMemory.DataFormats;

namespace VirtualTeacherGenAIDemo.Server.AI
{
    public class DocIntOCREngine : IOcrEngine
    {
        public Task<string> ExtractTextFromImageAsync(Stream imageContent, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
