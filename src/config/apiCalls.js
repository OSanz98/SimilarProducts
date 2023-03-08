import { apiRequest, loginRequest } from "./authConfig";
import { msalInstance } from "../index";
import axios from "axios";
// import { useMsal } from "@azure/msal-react";

export async function findSimilarProducts(title, accessToken) {
    try {
        const requestBody = {
            productTitle: title
        };
         
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
            // console.log(accessToken);
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestBody)
        };

        const response = await axios.post(`${apiRequest.url}`, config);

        const data = await response.json();
        return data;
    }catch(error) {
        return error;
    }
}

