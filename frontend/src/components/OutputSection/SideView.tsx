
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { SideGenerateButton } from '../UploadPhoto/GenerateButton';
import backplaceholder from '@/assets/backplaceholder.png';
import leftplaceholder from '@/assets/leftplaceholder.png';
import rightplaceholder from '@/assets/rightplaceholder.png';
import { resetSideImageState } from '@/features';
import ActionButtons from './ActionButtons';



function SideView() {
    let { backViewImage, leftViewImage, rightViewImage, isGenerated } = useSelector((state: RootState) => state.sideImageSlide);
    const dispatch = useDispatch();

    // have default if not generated
    if (!isGenerated) {
        backViewImage = backplaceholder;
        leftViewImage = leftplaceholder;
        rightViewImage = rightplaceholder;
    }
    else {
        backViewImage = backViewImage || '';
        leftViewImage = leftViewImage || '';
        rightViewImage = rightViewImage || '';
    }

    const sideViews = [
        { key: 'left', label: 'Left', src: leftViewImage, alt: 'Left Side' },
        { key: 'back', label: 'Back', src: backViewImage, alt: 'Back View' },
        { key: 'right', label: 'Right', src: rightViewImage, alt: 'Right Side' },
    ];

    const handleResetSideViews = () => {
        dispatch(resetSideImageState());
        return true;
    };

    // just return with a coming soon message, nothing else
    return (
        <div className="mx-auto max-w-2xl text-center py-10">
            Coming soon...  
        </div>
    );
    return (
        <div className="mx-auto max-w-2xl">
            {/* Compact row of three thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sideViews.map(({ key, label, src, alt }) => (
                    <div key={key} className="space-y-3">
                        <div className="aspect-square rounded-md overflow-hidden relative w-50 h-30 sm:w-full sm:h-full mx-auto">
                            <img
                                src={src}
                                alt={alt}
                                className="w-full h-full object-cover"
                            />
                            {!isGenerated &&
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 sm:bg-black/40">
                                    <span className="text-md text-white font-semibold tracking-wide">{label}</span>
                                </div>}
                        </div>
                        {isGenerated && (
                            <ActionButtons

                                onReset={handleResetSideViews}
                                url={src}
                                showIcons={
                                    {
                                        // regenerate: true,
                                        copy: true,
                                        // share: true,
                                        download: true,
                                        // likeDislike: true,
                                    }
                                }
                            />
                        )}
                    </div>
                ))}
            </div>

            {!isGenerated &&
                <div className="pt-4 flex justify-center">
                    <SideGenerateButton variant="default" size="lg" className="px-5" />
                </div>}

            {isGenerated && (
                <div className="pt-4 mt-6 flex justify-center">
                </div>
            )}

        </div>
    )
}

export default SideView

