import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { api } from '@/api/client';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils';


export const Profile: React.FC = () => {
    const navigate = useNavigate();

    const _redirectToLogin = () => {
        window.location.href = '/login';
    };

    const { mutate: logoutMutate } = api.auth.logoutApiV1AuthLogoutPost.useMutation(
        {},
        {
            onSuccess: () => {
                _redirectToLogin();
            },
            onError: (error) => {
                console.error(error);
                toast.error(getErrorMessage(error, 'Logout failed'));
                _redirectToLogin();
            }
        }
    );

    const { data: transactions } = api.payments.getTransactionsByUserIdApiV1PaymentsTransactionsGet.useQuery();

    const handleLogout = () => {
        // check if no user exists
        if (!user) {
            _redirectToLogin();
            return;
        }
        logoutMutate();
    };

    const { user, status } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!user && status === 'succeeded') {
            window.location.href = '/try';
        }
    }, [user, navigate, status]);

    return (
        <main className="flex flex-1 justify-center py-5 sm:py-10">
            <div className="flex flex-col w-full max-w-5xl gap-6 px-4">
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
                                <p className="text-primary font-medium">
                                    {user?.credits ?? 0} Credits Available
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

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                    <Table>
                        <TableCaption>A list of your recent transactions.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Credits</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions?.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.id}</TableCell>
                                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{transaction.quantity}</TableCell>
                                    <TableCell>{transaction.status}</TableCell>
                                    <TableCell className="text-right">₹{transaction.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </main>
    );
};

export default Profile;
