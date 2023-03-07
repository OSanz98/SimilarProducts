import { apiRequest, loginRequest } from "./authConfig";
import { msalInstance } from "../index";

export async function findSimilarProducts(title, accessToken) {
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
        // const authResult = await msalInstance.loginPopup();
        // const accessToken = authResult.accessToken;
        if(!accessToken) {
            const account = msalInstance.getActiveAccount();
            if(!account) {
                throw Error("No active accounts. Please sign in to an account");
            }

            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: account    
            });
            accessToken = response.accessToken;
        }


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

