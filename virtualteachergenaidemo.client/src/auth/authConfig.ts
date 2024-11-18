export interface AuthConfig {
    tenantId: string;
    clientId: string;
    authority: string;
    redirectUri: string;
}

export const fetchAuthConfig = async (): Promise<AuthConfig> => {
    const response = await fetch('/api/auth-config');
    if (!response.ok) {
        throw new Error('Failed to fetch auth config');
    }
    return response.json();
};
