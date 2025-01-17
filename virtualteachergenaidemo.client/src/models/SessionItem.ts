export class SessionItem {
    id: string;
    title?: string;    
    timestamp?: Date;
    userId: string;
    scenarioName: string;
    scenarioDescription: string;
    agents: SessionAgent[];
    isComplete?: boolean;
    completedTimestamp?: Date;

    constructor(id: string, title: string, timestamp: Date, userId: string,
        scenarioName: string, scenarioDescription: string,
        agents: SessionAgent[],
        isComplete: boolean, completedTimestamp: Date) {
        this.id = id;
        this.title = title;        
        this.timestamp = timestamp;
        this.userId = userId;
        this.scenarioName = scenarioName;
        this.scenarioDescription = scenarioDescription;
        this.agents = agents;
        this.isComplete = isComplete;
        this.completedTimestamp = completedTimestamp; 
    }
}

export class SessionAgent {
    id: string;
    name: string;
    prompt: string;
    type: string;
    features: { feature: string, prompt: string }[] | null | undefined;  

    constructor(id: string, name:string ,prompt: string, type: string, features: { feature: string, prompt: string }[] | null | undefined) {
        this.id = id;
        this.name = name;
        this.prompt = prompt;
        this.type = type;
        this.features = features;        
    }
}
