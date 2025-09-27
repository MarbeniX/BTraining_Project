//Plantilla de message confirm y back
import { useRoutineFormStore } from '@/stores/routineStore';
import { Fragment, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SaveChangesDialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    backLabel?: string;
    leading?: ReactNode;
}

export default function SaveChangesDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    backLabel = 'Back',
    leading,
}: SaveChangesDialogProps) {
    if (!isOpen) return null;

    const container = typeof window !== 'undefined' ? document.body : null;
    if (!container) return null;

    const setEditMode = useRoutineFormStore((state) => state.setEditMode)

    return createPortal(
        <Fragment>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-lg animate-fade-in">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        {leading ?? (
                            <div className="w-12 h-12 rounded-full bg-gray-500 flex-shrink-0" />
                        )}

                        <div>
                            <h2 className="text-xl font-bold leading-tight">{title}</h2>
                            <p className="text-sm text-gray-500 mt-1">{message}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onCancel}
                            className="cursor-pointer px-4 py-2 font-medium text-black hover:underline transition-all"
                        >
                            {backLabel}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                setEditMode(false); // Reset edit mode after confirmation
                            }}
                            className="cursor-pointer px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-black transition-all"
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>,
        container,
    );
}
