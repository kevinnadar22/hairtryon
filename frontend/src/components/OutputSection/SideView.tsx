
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import type { RootState } from '@/app/store';
import { SideGenerateButton } from '../UploadPhoto/GenerateButton';
import { backplaceholder, leftplaceholder, rightplaceholder } from '@/app/images';
import { resetSideImageState } from '@/features';
import ActionButtons from './ActionButtons';




function SideView() {
    let { backViewImage, leftViewImage, rightViewImage, isGenerated, isGenerating } = useSelector((state: RootState) => state.sideImageSlide);
    const dispatch = useDispatch();


    const sideViews = [
        { key: 'left', label: 'Left', placeholderSrc: leftplaceholder, src: leftViewImage, alt: 'Left Side' },
        { key: 'back', label: 'Back', placeholderSrc: backplaceholder, src: backViewImage, alt: 'Back View' },
        { key: 'right', label: 'Right', placeholderSrc: rightplaceholder, src: rightViewImage, alt: 'Right Side' },
    ];

    const handleResetSideViews = () => {
        dispatch(resetSideImageState());
        return true;
    };


    return (
        <div className="mx-auto max-w-2xl">
            {/* Compact row of three thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sideViews.map(({ key, label, src, placeholderSrc, alt }) => {

                    return (
                        <div key={key} className="space-y-3">
                            <div className="aspect-square rounded-md overflow-hidden relative w-50 h-30 sm:w-full sm:h-full mx-auto">

                                {/* if loading and original image not generated, show loading spinner */}
                                {isGenerating && !src &&
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                        {/* <Spinner className="size-8" /> */}
                                    </div>}

                                {/* when original image generated, show it or placeholder */}
                                <img
                                    src={src || placeholderSrc}
                                    alt={alt}
                                    className="w-full h-full object-cover"
                                />

                                {/* when not loading, or output image not generated, show idle state */}
                                {!isGenerating && !src &&
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 sm:bg-black/40">
                                        <span className="text-md text-white font-semibold tracking-wide">{label}</span>
                                    </div>}

                            </div>
                            {isGenerated && src && (
                                <ActionButtons

                                    onReset={handleResetSideViews}
                                    url={src}
                                    showIcons={
                                        {
                                            copy: true,
                                            download: true,
                                        }
                                    }
                                />
                            )}
                        </div>
                    );
                })}
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

