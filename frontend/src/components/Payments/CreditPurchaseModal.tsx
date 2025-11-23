import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../Landing/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { DodoPayments } from "dodopayments-checkout";
import { api } from "@/api/client";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils";
import { type RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { LoginPopup } from "../Auth/LoginPopup";

interface CreditPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [imageQuantity, setImageQuantity] = useState<number>(5);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        DodoPayments.Initialize({
            mode: "test", // 'test' or 'live'
            theme: "light", // 'light' or 'dark'
        });
    }, []);

    const { mutate: paymentMutate, isPending } =
        api.payments.createCheckoutSessionApiV1PaymentsCheckoutPost.useMutation(
            undefined,
            {
                onSuccess: (data) => {
                    // redirect to checkout url
                    window.location.href = data.checkout_url;
                },
                onError: (error) => {
                    console.log(error);
                    const msg = getErrorMessage(error);
                    toast.error(msg);
                    onClose();
                },
            }
        );


    const handlePurchase = () => {
        if (!user) {
            setShowLoginPopup(true);
            return;
        }
        paymentMutate({
            body: {
                quantity: imageQuantity,
            },
        });
    };

    const subtotal = imageQuantity * 1;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-md p-6 " onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Pay As You Go Plan
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Purchase images at ₹1 per image. Enter the quantity you'd like
                                to buy.
                            </p>

                            <div className="space-y-2">
                                <label htmlFor="quantity" className="text-sm font-medium">
                                    Number of Images
                                </label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={imageQuantity}
                                    onChange={(e) =>
                                        setImageQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Subtotal Card */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Quantity
                                </span>
                                <span className="font-medium">{imageQuantity} images</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Price per image
                                </span>
                                <span className="font-medium">₹1</span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Subtotal</span>
                                <span className="text-xl font-bold text-primary">
                                    ₹{subtotal}
                                </span>
                            </div>
                        </div>

                        <Button
                            disabled={isPending}
                            variant="primary"
                            className="w-full"
                            onClick={handlePurchase}
                        >
                            {isPending ? <Loader2 className="mr-2 h-4 w-4" /> : "Purchase"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <LoginPopup isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
        </>
    );
};
