import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';

interface MyInfoForm2 {
    name: string;
    email: string;
    password: string;
}
interface UserInfoEditPopupProps {
    isOpen: boolean;
    defaultValues: MyInfoForm2;
    onClose: () => void;
    onSubmit: (data: MyInfoForm2) => void;
}

export default function UserInfoEditPopup({
    isOpen,
    defaultValues,
    onClose,
    onSubmit,
}: UserInfoEditPopupProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<MyInfoForm2>({ defaultValues });

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
                        My information
                    </h2>

                    <div className="flex gap-8">
                        <div className="w-68 h-68 bg-gray-400/80 rounded-md flex-shrink-0" />

                        <form
                            className="flex flex-col flex-1 gap-3"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <label className="text-base font-medium">Name</label>
                            <div className="relative">
                                <input
                                    {...register('name')}
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200 text-gray-700 p-3 pr-12"
                                />
                                <Pencil
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                                />
                            </div>

                            <label className="text-base font-medium">E-mail</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200 text-gray-700 p-3 pr-12"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />
                            </div>

                            <label className="text-base font-medium">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200 text-gray-700 p-3 pr-12 tracking-widest"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters long',
                                        },
                                    })}
                                />
                                <Pencil
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
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
                                    className="w-24 py-2 rounded-md bg-gray-300 text-lg font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-default transition"
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
