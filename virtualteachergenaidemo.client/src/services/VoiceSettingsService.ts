import { VoiceSettings } from '../models/VoiceSettings';

export class VoiceSettingsService {
    private voices: VoiceSettings[];

    constructor() {
        this.voices = [
            new VoiceSettings('fr-FR-Remy:DragonHDLatestNeural', 'male', 'fr-FR'),
            new VoiceSettings('fr-FR-Vivienne:DragonHDLatestNeural', 'female', 'fr-FR'),
            new VoiceSettings('en-US-Andrew:DragonHDLatestNeural', 'male', 'en-US'),
            new VoiceSettings('en-US-Jenny:DragonHDLatestNeural', 'female', 'en-US')
        ];
    }

    getVoices(): VoiceSettings[] {
        return this.voices;
    }
}
