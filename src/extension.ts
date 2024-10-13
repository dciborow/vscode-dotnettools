import * as vscode from 'vscode';
import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-node';

const msalConfig: Configuration = {
    auth: {
        clientId: 'YOUR_CLIENT_ID',
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost'
    }
};

const pca = new PublicClientApplication(msalConfig);

async function authenticateWithMicrosoftAccount(): Promise<AuthenticationResult | null> {
    try {
        const authResult = await pca.acquireTokenByDeviceCode({
            deviceCodeCallback: (response) => {
                vscode.window.showInformationMessage(response.message);
            },
            scopes: ['user.read']
        });
        return authResult;
    } catch (error) {
        vscode.window.showErrorMessage(`Authentication failed: ${error}`);
        return null;
    }
}

async function authenticateToNuget() {
    const authResult = await authenticateWithMicrosoftAccount();
    if (authResult) {
        const accessToken = authResult.accessToken;
        // Use the access token to authenticate to Nuget in ADO
        // Add your Nuget authentication logic here
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.authenticateToNuget', authenticateToNuget)
    );
}

export function deactivate() {}
