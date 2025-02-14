export class VoiceSettings {
    voiceName: string;
    gender: string;
    language: string;

    constructor(voiceName: string, gender: string, language: string) {
        this.voiceName = voiceName;
        this.gender = gender;
        this.language = language;
    }

    get displayName(): string {
        return `${this.language} ${this.gender}`;
    }
}
