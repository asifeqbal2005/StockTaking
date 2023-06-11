import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const authCodeFlowConfig: AuthConfig = {
    issuer: 'https://login.microsoftonline.com/' + environment.tenantId+'/v2.0/',
    redirectUri: 'https://localhost:44313/',
    clientId: environment.clientId,
    responseType: 'code',
    strictDiscoveryDocumentValidation: false,
    scope: 'openid offline_access https://zusw02q1rsmweb1/RSMTool/api/',
    showDebugInformation: false,
};