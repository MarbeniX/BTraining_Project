//Plantilla de message back y save
import { Fragment, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SaveWorkoutDialogProps {

    isOpen: boolean;
    title?: string;
    message?: string;
    onSave: () => void;
    onBack: () => void;
    saveLabel?: string;
    backLabel?: string;
    leading?: ReactNode;
}

export default function SaveWorkoutDialog({
    isOpen,
    title,
    message,
    onSave,
    onBack,
    saveLabel = 'Save',
    backLabel = 'Back',
    leading,
}: SaveWorkoutDialogProps) {
    if (!isOpen) return null;

    const container = typeof window !== 'undefined' ? document.body : null;
    if (!container) return null;

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
                            onClick={onBack}
                            className="cursor-pointer px-4 py-2 font-medium text-black hover:text-gray-700 transition-all"
                        >
                            {backLabel}
                        </button>
                        <button
                            onClick={onSave}
                            className="cursor-pointer px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-black transition-all"
                        >
                            {saveLabel}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>,
        container,
    );
}
