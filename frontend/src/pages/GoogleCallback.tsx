import { useEffect } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

function GoogleCallback() {
    const { login } = useGoogleAuth();
    
    useEffect(() => {
        login();
    }, []);
    return (
        <div className="flex items-center justify-center h-screen">
        </div>
    );
}

export default GoogleCallback;