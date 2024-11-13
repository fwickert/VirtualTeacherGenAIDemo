export class ChatMessage {
    role: string;
    content: string;
    id: string;

    constructor(id: string, role: string, content: string) {
        this.id = id;
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