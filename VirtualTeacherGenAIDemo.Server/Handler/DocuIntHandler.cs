
using Microsoft.KernelMemory.Diagnostics;
using Microsoft.KernelMemory.Pipeline;

namespace VirtualTeacherGenAIDemo.Server.Handler
{
    public class DocuIntHandler : IPipelineStepHandler
    {
        public string StepName { get; }
        private readonly IPipelineOrchestrator _orchestrator;
        private readonly ILogger<DocuIntHandler> _log;

        public DocuIntHandler(IPipelineOrchestrator orchestrator, ILoggerFactory? loggerFactory = null)
        {
            _orchestrator = orchestrator;
            this._log = (loggerFactory ?? DefaultLogger.Factory).CreateLogger<DocuIntHandler>();
            StepName = "DocuIntHandler";

            this._log.LogInformation("Instantiating handler {0}...", this.GetType().FullName);
        }

        public async Task<(ReturnType returnType, DataPipeline updatedPipeline)> InvokeAsync(DataPipeline pipeline, CancellationToken cancellationToken = default)
        {
            this._log.LogInformation("Running handler {0}...", this.GetType().FullName);

            Console.WriteLine("** My handler is working ** ");

            Console.WriteLine("Index: " + pipeline.Index);
            Console.WriteLine("Document Id: " + pipeline.DocumentId);
            Console.WriteLine("Steps: " + string.Join(", ", pipeline.Steps));
            Console.WriteLine("Remaining Steps: " + string.Join(", ", pipeline.RemainingSteps));

            await Task.Delay(0, cancellationToken).ConfigureAwait(false);

            return (ReturnType.Success, pipeline);

        }

        
    }
}
