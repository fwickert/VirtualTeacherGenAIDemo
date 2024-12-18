export class AgentItem {
    id: string;
    name: string;
    description: string;
    prompt: string;
    type: string;
    fileNames: string[];

    constructor(id: string, name: string, description: string, prompt: string, type: string, fileNames: string[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.prompt = prompt;
        this.type = type;
        this.fileNames = fileNames;
    }
}
