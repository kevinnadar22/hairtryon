import { setAuthStatus } from '@/features';
import { cleanPath } from '@/utils/helpers';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Config from '@/app/config';

function useGoogleAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function login() {
        cleanPath();
        navigate("/try");
    }

    function googleLoginCallback() {
        cleanPath();
        window.opener.postMessage({ type: "oauth_success" }, window.opener.location.origin);
    }


    function getGoogleRedirect() {
        const baseUrl = Config.API_URL;
        // Construct the full URL for Google OAuth redirect
        return `${baseUrl}/api/v1/auth/google`;
    }


    const handleGoogleSignIn = () => {
        dispatch(setAuthStatus("loading"));
        const redirectUrl = getGoogleRedirect();
        // window.location.href = redirectUrl;
        const popup = window.open(
            redirectUrl,
            "google_oauth",
            "width=500,height=600,menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes"
        );
        if (!popup) return;

        const listener = (event: MessageEvent) => {
            if (event.data?.type === "oauth_success") {
                dispatch(setAuthStatus("succeeded"));
                window.removeEventListener("message", listener);
                popup.close();
                navigate("/try");
            }

            if (event.data?.type === "oauth_error") {
                dispatch(setAuthStatus("failed"));
                window.removeEventListener("message", listener);
                popup.close();
                navigate("/try");
            }
        };

        window.addEventListener("message", listener);
    }
    return { handleGoogleSignIn, login, googleLoginCallback };
}

export { useGoogleAuth };