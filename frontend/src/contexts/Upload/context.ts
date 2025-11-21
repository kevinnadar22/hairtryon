import type { useUpload } from "@/hooks/useUpload";
import { createContext, useContext } from "react";


const UploadContext = createContext<ReturnType<typeof useUpload> | null>(null);

export const useUploadContext = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error("useUploadContext must be used within an UploadProvider");
    }
    return context;
}

export default UploadContext;