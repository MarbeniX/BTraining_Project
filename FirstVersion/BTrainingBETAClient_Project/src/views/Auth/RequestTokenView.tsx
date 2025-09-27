import { toast, ToastContainer } from "react-toastify"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { requestCode } from "@/services/AuthService";
import type { AuthRequestCodeForm } from "@/types/authTypes";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function RequestTokenView() {
    const initialValues = {
        email: ''
    }  

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: requestCode,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message);
            setTimeout(() => {
                navigate('/auth/confirm-account');
            }, 1000); // Espera 1 segundo antes de navegar
        }
    }) 

    const handleRequestCode = (formData: AuthRequestCodeForm) => {
        mutate(formData);
    }

    return (
        <>
            <h1 className="text-3xl">Request code</h1>
            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className="bg-white p-4 rounded-md shadow-md flex flex-col"
                noValidate
            >
                <label className="text-2xl">Email</label>
                <input
                    id="email"
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address'
                        }
                    })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}

                <input
                    type="submit"
                    value="Request Code"
                    className="bg-amber-600 text-white p-2 mt-2 rounded-md cursor-pointer hover:bg-amber-7s00 transition-colors"
                />
            </form>

            <nav className="flex justify-center mt-3">
                <Link to={'/auth'}>
                    Log in
                </Link>
            </nav>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
        </>
    )
}
