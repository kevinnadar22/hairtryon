import React, { useEffect, useState } from 'react';
import StyleCard from './StyleCard';
import { BlurFade } from '../ui/blur-fade';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useSelector } from 'react-redux';
import { type RootState, } from '@/app/store';
import GenerateButton from '../UploadPhoto/GenerateButton';
import { api } from '@/api/client';
import { useDispatch } from "react-redux";
import { setStyleId } from "@/features/imageSlide/slice";
import { useUploadContext } from '@/contexts';


type StylesResponse = typeof api.image.getImageStylesApiV1ImageStylesGet.types.data[number];

const NoStylesFound: React.FC = () => (
    <div className="flex-1 overflow-y-auto max-h-96 min-h-0 mt-4 ">
        <p className="text-sm text-center text-muted-foreground">No hairstyles found</p>
    </div>
);


const StylesGrid: React.FC<{ styles: StylesResponse[], selectedHairstyle: number | null, setSelectedHairstyle: (id: number) => void }> = ({ styles, selectedHairstyle, setSelectedHairstyle }) => (
    <BlurFade className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 px-1">
        {styles?.map((style) => (
            <StyleCard key={style.id} id={style.id} name={style.name} image={style.image_url} isSelected={selectedHairstyle === style.id} onSelect={setSelectedHairstyle} />
        ))}
    </BlurFade>
);

const Styles: React.FC = () => {
    // State for the selected hairstyle
    const dispatch = useDispatch();

    const { userUploadedImage } = useUploadContext();
    const { styleId: selectedHairstyle } = useSelector((state: RootState) => state.imageSlide);

    // States for hairstyles and celebrity hairstyles
    const [hairstyles, setHairstyles] = useState<StylesResponse[]>([]);
    const [celebrityHairstyles, setCelebrityHairstyles] = useState<StylesResponse[]>([]);

    // Fetch styles from the API
    useEffect(() => {
        const fetchStyles = async () => {
            const stylesData = await api.image.getImageStylesApiV1ImageStylesGet();
            const hairstyles = stylesData.data?.filter((style) => style.category === 'standard') || [];
            const celebrityHairstyles = stylesData.data?.filter((style) => style.category === 'celebrity') || [];
            setHairstyles(hairstyles);
            setCelebrityHairstyles(celebrityHairstyles);
        };
        fetchStyles();
    }, []);

    const setSelectedHairstyle = (id: number) => {
        dispatch(setStyleId(id));
    }

    const renderStyleGrid = (styles: StylesResponse[]) => (
        <StylesGrid styles={styles} selectedHairstyle={selectedHairstyle} setSelectedHairstyle={setSelectedHairstyle} />
    );


    return (
        <Card className="p-6 h-fit relative">
            <div className="w-full flex flex-col h-full">
                <div className="shrink-0">
                    <h3 className="text-lg font-bold mb-4">Style</h3>

                    <Tabs defaultValue="hairstyle" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="hairstyle" className="text-sm">
                                Hairstyle
                            </TabsTrigger>
                            <TabsTrigger value="celebrity" className="text-sm">
                                Celebrity Hairstyle
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="hairstyle" className="mt-0">
                            {hairstyles.length > 0 ? (
                                renderStyleGrid(hairstyles)
                            ) : (
                                <NoStylesFound />
                            )}
                        </TabsContent>

                        <TabsContent value="celebrity" className="mt-0">
                            {celebrityHairstyles.length > 0 ? (
                                renderStyleGrid(celebrityHairstyles)
                            ) : (
                                <NoStylesFound />
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Floating Generate Button at bottom center */}
            <div className="sticky bottom-0 left-0 right-0 flex justify-center py-3 bg-linear-to-t from-background via-background to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <GenerateButton />
                </div>
            </div>
        </Card>
    );
};

export default Styles;