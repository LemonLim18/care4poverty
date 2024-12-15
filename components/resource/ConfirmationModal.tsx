import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from 'components/ui/dialog';

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden">Open</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Update</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to update the resource amounts? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex justify-end">
                    <button onClick={onConfirm} className="px-4 py-2 mr-2 bg-blue-500 text-white rounded">
                        Yes
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        No
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;