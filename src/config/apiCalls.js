import { apiRequest, msalConfig, tokenRequest } from "./authConfig";
import * as msal from '@azure/msal-browser';

const msalInstance = new msal.PublicClientApplication(msalConfig);

export async function findSimilarProducts(title) {
    try {
        const requestBody = {
            productTitle: title
        };
         
        // const accounts = await msalInstance.getAllAccounts();
        // if(accounts.length === 0) {
        //     throw new Error('No accounts found.');
        // }

        // msalInstance.setActiveAccount(accounts[0]);

        // const accessToken = await msalInstance.acquireTokenSilent(tokenRequest);
        const authResult = await msalInstance.loginPopup();
        const accessToken = authResult.accessToken;

        const response = await fetch(`${apiRequest.url}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data;
    }catch(error) {
        return error;
    }
}

