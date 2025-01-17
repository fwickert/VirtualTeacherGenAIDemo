import { SessionItem } from '../models/SessionItem';

export enum AuthorRole {
    User,
    Assistant,
    System
}

export class ChatHistoryRequest {
    messages: ChatMessage[];
    userId: string;
    session: SessionItem;

    constructor(userId: string, session: SessionItem, messages: ChatMessage[]) {
        this.userId = userId;
        this.session = session;
        this.messages = messages;
    }
}

export class ChatMessage {
    role: AuthorRole;
    content: string;
    id: string;

    constructor(id: string, role: AuthorRole, content: string) {
        this.id = id;
        this.role = role;
        this.content = content;
    }
}
