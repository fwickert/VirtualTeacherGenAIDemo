export class SessionItem {
    id: string;
    title?: string;
    isComplete?: boolean;
    timestamp?: Date;
    userId: string;
    scenarioName: string;
    scenarioDescription: string;
    agents: SessionAgent[];

    
    constructor(id: string, title: string, isComplete: boolean, timestamp: Date, userId: string, scenarioName: string, scenarioDescription: string, agents: ISessionAgent[]) {
        this.id = id;
        this.title = title;
        this.isComplete = isComplete;
        this.timestamp = timestamp;
        this.userId = userId;
        this.scenarioName = scenarioName;
        this.scenarioDescription = scenarioDescription;
        this.agents = agents;
    }
}

export class SessionAgent {
    prompt: string;
    type: string;

    
    constructor(prompt: string, type: string) {
        this.prompt = prompt;
        this.type = type;
    }
}