export interface AuthConfig {
    tenantId: string;
    clientId: string;
    authority: string;
    redirectUri: string;
}

export { fetchAuthConfig } from '../services/AuthService';
