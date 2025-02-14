import { VoiceSettings } from './VoiceSettings';
export class ScenarioItem {
    id: string;
    name: string;
    description: string;
    agents: Agent[];
    users: { userId: string, sharedUser: boolean }[];
    voice: VoiceSettings;

    constructor(id: string, name: string, description: string, agents: Agent[], users: { userId: string, sharedUser: boolean }[], voiceSettings: VoiceSettings) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.agents = agents;
        this.users = users;
        this.voice = voiceSettings;
    }
}

// Add class Agent

export class Agent {
    id: string;
    name: string;
    prompt: string;
    type: string;
    features: { feature: string, prompt: string }[] | null | undefined;    
    constructor(id: string, name: string, prompt: string, type: string, features: { feature: string, prompt: string }[] | null | undefined) {
        this.id = id;
        this.name = name;
        this.prompt = prompt;
        this.type = type;
        this.features = features;
     
    }
}
