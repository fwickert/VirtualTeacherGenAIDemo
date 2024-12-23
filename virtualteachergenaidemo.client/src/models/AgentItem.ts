export class AgentItem {
    id: string;
    name: string;
    description: string;
    prompt: string;
    type: string;
    fileNames: string[];
    features: { feature: string, prompt: string }[] | null | undefined;

    constructor(id: string, name: string, description: string, prompt: string, type: string, fileNames: string[], features: { feature: string, prompt: string }[] | null | undefined) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.prompt = prompt;
        this.type = type;
        this.fileNames = fileNames;
        this.features = features;
    }
}
