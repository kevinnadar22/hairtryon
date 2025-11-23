
import { UploadPhoto } from '@/components/UploadPhoto';
import { Styles } from '@/components/Styles';
import { History } from '@/components/History';
// import {useUploadContext} from '@/contexts';

function PhotoEditorPage() {
    // const { userUploadedImage } = useUploadContext();
    
    return (
        <main className={`w-full max-w-3xl mx-auto flex-1 py-4 px-4`}>
            <div className="flex flex-col gap-8">
                <UploadPhoto />

                {<Styles />}

                <div className="overflow-x-auto">
                    <History />
                </div>
            </div>
        </main>
    );
}

export default PhotoEditorPage
