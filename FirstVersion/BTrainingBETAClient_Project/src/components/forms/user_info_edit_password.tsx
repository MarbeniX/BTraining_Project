import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

interface MyInfoForm3 {
    name: string;
    email: string;
    password: string;
}
interface UserInfoPasswordPopupProps {
    isOpen: boolean;
    defaultValues: MyInfoForm3;
    onClose: () => void;
    onSubmit: (data: MyInfoForm3) => void;
}

export default function UserInfoPasswordPopup({
                                          isOpen,
                                          defaultValues,
                                          onClose,
                                          onSubmit,
                                      }: UserInfoPasswordPopupProps) {
    const {
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<MyInfoForm3>({ defaultValues });

    if (!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null;
    if (!container) return null;

    return createPortal(
        <Fragment>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => {
                    reset();
                    onClose();
                }}
            >
                <div
                    className="bg-white rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-6 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-center text-2xl font-semibold">
                        Resset Password
                    </h2>

                    <div className="flex gap-8">
                        <div className="w-68 h-68 bg-gray-400/80 rounded-md flex-shrink-0" />

                        <form
                            className="flex flex-col flex-1 gap-3"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <label className="text-base font-medium">Current Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    title="Enter your current password"
                                    placeholder="Enter your current password"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200
                 text-gray-700 p-3 pr-12"
                                />
                            </div>

                            <label className="text-base font-medium">New Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    title="Enter your new password"
                                    placeholder="Enter your new password"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200
                 text-gray-700 p-3 pr-12"
                                />
                            </div>

                            <label className="text-base font-medium">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    title="Enter your new password again"
                                    placeholder="Enter your new password again"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200
                 text-gray-700 p-3 pr-12"
                                />
                            </div>
                            <div className="mt-8 flex justify-end gap-8">
                                <button
                                    type="button"
                                    className="text-lg font-medium hover:underline"
                                    onClick={() => {
                                        reset();
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={!isDirty}
                                    className="w-24 py-2 rounded-md bg-gray-300 text-black text-lg font-medium
             hover:bg-gray-400 disabled:opacity-50 disabled:cursor-default transition"
                                >
                                    Save
                                </button>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </Fragment>,
        container,
    );
}
