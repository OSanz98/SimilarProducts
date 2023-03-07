
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from '../sign-in-button/sign-in-button.component';
import { SignOutButton } from '../sign-out-button/sign-out-button.component';
import { InteractionStatus } from "@azure/msal-browser";

const AuthButton = () => {
    const { inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (isAuthenticated) {
        return <SignOutButton />;
    } else if (inProgress !== InteractionStatus.Startup && inProgress !== InteractionStatus.HandleRedirect) {
        // inProgress is used to prevent the sign in button from appearing shortly after returning from a redirect url. 
        // the server response takes a couple of render cycles usually.
        return <SignInButton />;
    } else {
        return null;
    }
}

export default AuthButton;