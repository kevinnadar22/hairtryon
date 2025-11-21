// used in PhotoEditorPage to provide upload context

import { useUpload } from '@/hooks/useUpload';
import UploadContext from './context';

const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const upload = useUpload();
    return (
        <UploadContext.Provider value={upload}>
            {children}
        </UploadContext.Provider>
    );
}
export { UploadProvider };