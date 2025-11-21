import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { RootState } from '@/app/store';
import { useSelector } from 'react-redux';

import { logout } from '@/features';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {api} from '@/api/client';
import { toast } from 'sonner';
    

export const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {mutate: logoutMutate} = api.auth.logoutApiV1AuthLogoutPost.useMutation(
        {},
        {
            onSuccess: () => {
                dispatch(logout());
                navigate('/try');
            },
            onError: (error) => {
                console.error(error);
                toast.error('Failed to logout, please try again');
            },
        }
    );

    const handleLogout = () => {
        logoutMutate();
    };

    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/try');
        }
    }, [user, navigate]);

    return (
        <main className="flex flex-1 justify-center py-5 sm:py-10">
            <div className="flex flex-col w-full max-w-5xl flex-1 px-4">
                {/* Profile Header */}
                <Card className="p-6 @container">
                    <div className="flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                        <div className="flex gap-4 sm:gap-6 items-center">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                                <AvatarImage
                                    src={user?.profilePictureUrl || undefined}
                                    alt={user?.name || 'User Profile'}
                                />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-center gap-1">
                                <p className="text-foreground text-2xl font-bold leading-tight tracking-[-0.015em]">
                                    {user?.name || 'User Name'}
                                </p>
                                <p className="text-muted-foreground text-base font-normal leading-normal">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            className="w-full max-w-[480px] @[520px]:w-auto bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30 dark:hover:bg-primary/40"
                        >
                            Logout
                        </Button>
                    </div>
                </Card>



            </div>
        </main>
    );
};

export default Profile;
