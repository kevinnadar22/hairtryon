import { setAuthStatus} from '@/features';
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

    function getGoogleRedirect() {
        const baseUrl = Config.API_URL;
        // Construct the full URL for Google OAuth redirect
        return `${baseUrl}/api/v1/auth/google`;
    }


    const handleGoogleSignIn = () => {
        dispatch(setAuthStatus("loading"));
        const redirectUrl = getGoogleRedirect();
        window.location.href = redirectUrl;
    }
    return { handleGoogleSignIn, login };
}

export { useGoogleAuth };