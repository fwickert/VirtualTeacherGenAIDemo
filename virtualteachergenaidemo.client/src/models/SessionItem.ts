export interface ISessionItem {
    id: string;
    title?: string;
    isComplete?: boolean;
    timestamp?: Date;
    userId: string;
    scenarioName: string;
    scenarioDescription: string;
    agents: ISessionAgent[];

}

export interface ISessionAgent {
    prompt: string;
    type: string;
}