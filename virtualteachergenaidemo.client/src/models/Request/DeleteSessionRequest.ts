export class DeleteSessionRequest {
    sessionId: string;
    userId: string;

    constructor(sessionId: string, userId: string) {
        this.sessionId = sessionId;
        this.userId = userId;
    }
}
