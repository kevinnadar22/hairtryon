import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import type { RootState } from '@/app/store';
import { api } from '@/api/client';
import { Error, Loading, Button, IsoImage, HistoryImageCard, Card } from '@/components';

import { Toggle } from '@/components/ui/toggle';
import { Heart } from 'lucide-react';

import historyiso from '@/assets/historyiso.png';
import noitemsfound from '@/assets/noitemsfound.jpg';

const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const { ref, inView } = useInView();
    const [showFavourites, setShowFavourites] = React.useState(false);

    const {
        data: historyItems,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingInfinite,
        isError: infiniteIsError,
    } = api.user.getUserImagesApiV1UserImagesGet.useInfiniteQuery(
        { query: { page: 1, favourites: showFavourites ? true : false } },
        {
            enabled: !!user,
            initialPageParam: {
                query: {
                    page: 1,
                    favourites: showFavourites ? true : false
                }
            },
            getNextPageParam: (lastPage, _) => {
                return lastPage.next_page ? { query: { page: lastPage.next_page, favourites: showFavourites ? true : false } } : undefined;
            }
        }
    )

    const handleToggleFavourites = () => {
        setShowFavourites((prev) => !prev);
        // Reset to first page when toggling favourites
        // This will be handled automatically by useInfiniteQuery due to the dependency on showFavourites

    }


    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage && user) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


    // Show loading state
    if (isLoadingInfinite) {
        return <Loading message="Loading your history..." className='min-h-[50vh]' />;
    }

    // Show error state
    if (infiniteIsError) {
        return <Error
            title="Failed to Load History"
            message="There was an error loading your history. Please try again later."
            onRetry={() => window.location.reload()}
            retryText="Retry"
        />;
    }


    if (!user) {
        // show a message to log in
        return (
            <div className="container min-h-screen mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <IsoImage src={historyiso} alt="History" className="w-8 h-8 text-primary" />
                        History
                    </h1>
                </div>
                <Card className="p-12 text-center">
                    <h3 className="text-xl font-semibold text-foreground">Please Log In</h3>
                    <p className="text-muted-foreground">
                        You need to be logged in to view your history.
                    </p>
                    <div className="max-w-xs mx-auto">
                        <Button onClick={() => navigate('/login')} size="lg">
                            Go to Login
                        </Button>
                    </div>
                </Card>

            </div>
        );
    }

    if (historyItems?.pages[0].total_images === 0) {
        return (
            <div className="container min-h-screen mx-auto px-4 py-8 max-w-5xl">
                <Card className="text-center p-8 shadow-none border-0">
                    <IsoImage src={noitemsfound} alt="No Items Found" className="w-32 h-32 mx-auto text-muted-foreground opacity-90" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No History Yet</h3>
                    <p className="text-muted-foreground">
                        Your generated images will appear here once you start creating.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold flex items-center gap-1">
                        <IsoImage src={historyiso} alt="History" className="w-10 h-10 text-primary" />
                        History
                        <span className="text-sm font-normal text-muted-foreground">
                            ({historyItems?.pages[0].total_images} {historyItems?.pages[0].total_images === 1 ? 'item' : 'items'})
                        </span>
                    </h1>

                    {/* Favourites control placed next to the title for clarity */}
                    <div className="flex items-center gap-2 ml-1">
                        <Toggle
                            onClick={handleToggleFavourites}
                            className="bg-secondary p-2 rounded-lg flex items-center justify-center"
                            aria-label="Toggle Favourites"
                            aria-pressed={showFavourites}
                            title={showFavourites ? 'Showing favourites' : 'Show favourites'}
                        >
                            <Heart
                                className={showFavourites ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-muted-foreground'}
                                fill={showFavourites ? 'currentColor' : 'none'}
                                stroke={showFavourites ? 'none' : 'currentColor'}
                                strokeWidth={showFavourites ? 0 : 1.5}
                            />
                        </Toggle>
                        <span className="text-sm text-muted-foreground">Favourites</span>
                    </div>
                </div>
            </div>

            {/* History Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {historyItems?.pages
                    .flatMap((page) => page.images)
                    .map((img) => (
                        <div key={img.id} className="relative group">
                            <HistoryImageCard
                                item={img}
                                size="lg"
                                className="w-full h-auto aspect-square"
                            />
                        </div>
                    ))}
            </div>

            <div ref={ref}>
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? 'Scroll to load more'
                        : ''}
            </div>

        </div>
    );
};

export default HistoryPage;

