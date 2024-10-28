export class ChatMessage {
    role: string;
    content: string;

    constructor(role: string, content: string) {
        this.role = role;
        this.content = content;
    }
}

export class ChatHistoryRequest {
    messages: ChatMessage[];

    constructor(messages: ChatMessage[]) {
        this.messages = messages;
    }
}