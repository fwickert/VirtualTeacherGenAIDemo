using System.ComponentModel.DataAnnotations;

namespace VirtualTeacherGenAIDemo.Server.Options
{
    public class ServiceOptions
    {
        public const string PropertyName = "Service";

        /// <summary>
        /// Configuration Key Vault URI
        /// </summary>
        [Url]
        public string? KeyVault { get; set; }

        /// <summary>
        /// Local directory in which to load semantic plugins.
        /// </summary>
        public string? SemanticPluginsDirectory { get; set; }
    }
}
