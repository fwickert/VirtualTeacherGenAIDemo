import { SessionItem } from '../models/SessionItem';

export class ChatHistoryRequest {
    messages: ChatMessage[];
    userId: string;
    session: SessionItem;

    constructor(userId: string, session:SessionItem, messages: ChatMessage[]) {
        this.userId = userId;
        this.session = session;
        this.messages = messages;
    }
}

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

