import { Fragment, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    leading?: ReactNode;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    leading,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const container = typeof window !== 'undefined' ? document.body : null;
    if (!container) return null;

    return createPortal(
        <Fragment>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-lg animate-fade-in">
                    <div className="flex items-start gap-4">
                        {/* Leading icon / avatar */}
                        {leading ?? (
                            <div className="w-12 h-12 rounded-full bg-gray-500 flex-shrink-0" />
                        )}

                        {/* Text content */}
                        <div>
                            <h2 className="text-xl font-bold leading-tight">{title}</h2>
                            <p className="text-sm text-gray-500 mt-1">{message}</p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onConfirm}
                            className="cursor-pointer px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-all"
                        >
                            {confirmLabel}
                        </button>
                        <button
                            onClick={onCancel}
                            className="cursor-pointer px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition-all"
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>,
        container
    );
}
