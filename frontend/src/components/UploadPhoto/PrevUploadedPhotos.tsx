import React from 'react';
import { Card } from '../ui/card';
import { ChevronRight } from 'lucide-react';
import { useUploadContext } from '@/contexts/Upload/context';
import {api} from '@/api/client';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const PrevUploadedPhotos: React.FC = () => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showArrow, setShowArrow] = React.useState(true);

    const {data: uploadedPhotos} = api.user.getUserUploadsApiV1UserUploadsGet.useQuery(
        undefined, {
            enabled: !!useSelector((state: RootState) => state.auth.user)
        }
    );

    const {  selectFileFromUrl } = useUploadContext();

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            // Hide arrow when scrolled to the end (with a small threshold of 10px)
            setShowArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    React.useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            // Check initial state
            handleScroll();
        }
    }, []);

    const handleClick = (photo: string) => {
        selectFileFromUrl(photo);
    }

    // if not uploaded photos, return null
    if (!uploadedPhotos || uploadedPhotos.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-6">
            <h3 className="text-lg font-semibold mb-4">Previously Uploaded Images</h3>

            <div className="relative">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {uploadedPhotos?.map((photo, index) => (
                        <Card
                            key={index}
                            onClick={() => handleClick(photo)}
                            className="hover:scale-102 w-24 h-24 shrink-0 cursor-pointer transition-all duration-200 p-0 overflow-hidden"
                        >
                            <img
                                src={photo}
                                alt={`Previously uploaded ${index + 1}`}
                                className="w-full h-full object-cover object-top"
                            />

                        </Card>
                    ))}
                </div>

                {/* Gradient overlay and arrow indicator on the right */}
                {showArrow && (
                    <div className="absolute top-0 right-0 bottom-2 w-20 bg-linear-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-2 transition-opacity duration-300">
                        <div className="bg-primary/5 rounded-full p-1">
                            <ChevronRight className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrevUploadedPhotos;
