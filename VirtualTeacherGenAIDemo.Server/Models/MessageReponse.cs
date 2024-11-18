using Microsoft.SemanticKernel.ChatCompletion;

namespace VirtualTeacherGenAIDemo.Server.Models
{
    public class MessageResponse
    {
        public string MessageId { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// State = Start, InProgress, End
        /// </summary>
        public string State { get; set; } = string.Empty;

        /// <summary>
        /// For target the right input in html client
        /// </summary>
        public string WhatAbout { get; set; } = string.Empty;

        public  AuthorRole? Role { get; set; }

        public string SessionId { get; set; } = string.Empty;

    }
}
