using DocumentFormat.OpenXml.Office2013.Excel;

namespace VirtualTeacherGenAIDemo.Server.Models.Storage
{
    public class VoiceSettings
    {
        public string VoiceName { get; set; } = string.Empty;
                
        public string Gender { get; set; } = string.Empty;

        public string Language { get; set; } = string.Empty;

    }
}
