using System.ComponentModel.DataAnnotations;

namespace VirtualTeacherGenAIDemo.Server.Options
{
    public class DocumentIntelligentOptions
    {
        public const string PropertyName = "DocumentIntelligent";

        [Required, NotEmptyOrWhitespace]
        public string Endpoint { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string Key { get; set; } = string.Empty;

        [Required, NotEmptyOrWhitespace]
        public string IndexName { get; set; } = string.Empty;
    }
}
