import { Fragment, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';

import UserInfoEditPopup      from '@/components/forms/user_info_edit_name.tsx';
import UserInfoPasswordPopup  from '@/components/forms/user_info_edit_password.tsx';

interface MyInfoForm {
    name: string;
    email: string;
    password: string;
}
interface UserInfoPopupProps {
    isOpen: boolean;
    defaultValues: MyInfoForm;
    onClose: () => void;
    onSubmit: (data: MyInfoForm) => void;
}

export default function UserInfoPopup({
    isOpen,
    defaultValues,
    onClose,
    onSubmit,
}: UserInfoPopupProps) {

    const { register, handleSubmit, reset } = useForm<MyInfoForm>({
        defaultValues,
    });

    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [pwdPopupOpen,  setPwdPopupOpen]  = useState(false);

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
                    <h2 className="text-center text-2xl font-semibold">My information</h2>

                    <div className="flex gap-8">
                        <div className="w-68 h-68 bg-gray-400/80 rounded-md flex-shrink-0" />

                        <form className="flex flex-col flex-1 gap-3" onSubmit={handleSubmit(onSubmit)}>
                            <label className="text-base font-medium">Name</label>
                            <div className="relative">
                                <input
                                    {...register('name')}
                                    readOnly
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200 text-gray-700 p-3 pr-12"
                                />
                                <Pencil
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditPopupOpen(true);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                                />
                            </div>

                            <label className="text-base font-medium">E-mail</label>
                            <div className="relative">
                                <input
                                    {...register('email')}
                                    readOnly
                                    type="email"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200 text-gray-700 p-3 pr-12"
                                />
                            </div>

                            <label className="text-base font-medium">Password</label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    readOnly
                                    type="password"
                                    className="w-76 max-w-full border border-gray-300 rounded-md bg-gray-200 text-gray-700 p-3 pr-12 tracking-widest"
                                />
                                <Pencil
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPwdPopupOpen(true);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <UserInfoEditPopup
                isOpen={editPopupOpen}
                defaultValues={defaultValues}
                onClose={() => setEditPopupOpen(false)}
                onSubmit={(data: MyInfoForm) => {
                    console.log('Datos actualizados:', data);
                    setEditPopupOpen(false);
                }}
            />

            <UserInfoPasswordPopup
                isOpen={pwdPopupOpen}
                defaultValues={{ name: '', email: '', password: '' }}
                onClose={() => setPwdPopupOpen(false)}
                onSubmit={(data: MyInfoForm) => {
                    console.log('Nuevo password:', data);
                    setPwdPopupOpen(false);
                }}
            />
        </Fragment>,
        container,
    );
}
