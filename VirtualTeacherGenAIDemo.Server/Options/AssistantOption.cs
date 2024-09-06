namespace VirtualTeacherGenAIDemo.Server.Options
{
    public class AssistantOption
    {
        public const string PropertyName = "Assistant";

        /// <summary>
        /// The persona to use for the chat.
        /// </summary>
        public string Persona { get; set; } = string.Empty;
    }
}
