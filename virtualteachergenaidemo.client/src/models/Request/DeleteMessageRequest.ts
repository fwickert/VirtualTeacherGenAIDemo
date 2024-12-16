export class DeleteMessageRequest {
    messageId: string;
    sessionId: string;

    constructor(messageId: string, sessionId: string) {
        this.messageId = messageId;
        this.sessionId = sessionId;
    }
}
