import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface LoginPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login Required</DialogTitle>
                    <DialogDescription>
                        You need to be logged in to perform this action.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <p className="text-sm text-muted-foreground">
                        Please log in to continue with your experience.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Link to="/login" className="w-full sm:w-auto">
                        <Button className="w-full">
                            Login
                        </Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
