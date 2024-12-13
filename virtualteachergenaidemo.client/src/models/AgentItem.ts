export class AgentItem {
    id: string;
    name: string;
    description: string;
    prompt: string;
    type: string;
    fileNames: string;


    constructor(id: string, name: string, description:string, prompt:string, type:string, fileNames:string) {
        this.id = id;
        this.description = description;
        this.name = name;
        this.prompt = prompt;
        this.type = type;
        this.fileNames = fileNames;

    }
}

