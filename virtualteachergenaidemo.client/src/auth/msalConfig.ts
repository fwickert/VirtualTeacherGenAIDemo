import { PublicClientApplication, Configuration } from '@azure/msal-browser';
import { fetchAuthConfig, AuthConfig } from './authConfig';

let msalInstance: PublicClientApplication | null = null;

export const initializeMsal = async (): Promise<PublicClientApplication> => {
    if (msalInstance) {
        return msalInstance;
    }

    const authConfig: AuthConfig = await fetchAuthConfig();

    const msalConfig: Configuration = {
        auth: {
            clientId: authConfig.clientId,
            authority: authConfig.authority,
            redirectUri: authConfig.redirectUri,
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: false,
        }
    };

    msalInstance = new PublicClientApplication(msalConfig);
    return msalInstance;
};
