import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Import necessary components from ShadCN

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    resourceName: string; // Name of the resource to display in the warning
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onClose, onConfirm, resourceName }) => {
    // console.log("Resource Name in Warning Modal: ", resourceName);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden">Open</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Warning</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>"{resourceName}"</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex justify-end">
                    <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 mr-2 bg-red-500 hover:bg-red-600 text-white rounded">
                        Yes, Delete
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WarningModal;