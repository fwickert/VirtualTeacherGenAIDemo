export class AgentItem {
    id: string;
    name: string;
    description: string;
    prompt: string;

    constructor(id: string, name: string, description:string, prompt:string) {
        this.id = id;
        this.description = description;
        this.name = name;
        this.prompt = prompt;
    }
}

