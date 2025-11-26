import { useEffect } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

function GoogleCallback() {
    const { googleLoginCallback } = useGoogleAuth();
    // get success or error from url
    const success = new URLSearchParams(window.location.search).get("success");
    const error = new URLSearchParams(window.location.search).get("error");
    
    useEffect(() => {
        if (success) {
            googleLoginCallback("oauth_success");
        }
        if (error) {
            googleLoginCallback("oauth_error", error);
        }
    }, []);
    return (
        <div className="flex items-center justify-center h-screen">
        </div>
    );
}

export default GoogleCallback;