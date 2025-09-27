import { toast, ToastContainer } from "react-toastify"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { requestPasswordCode } from "@/services/AuthService"
import type { AuthRequestCodeForm } from "@/types/authTypes"
import { Link } from "react-router-dom"

export default function RequestPasswordCode() {
    const initialValues = {
        email: '',
    }

    const { register, handleSubmit, formState: { errors } } = useForm({defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: requestPasswordCode,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const handleRequestCode = (formData: AuthRequestCodeForm) => {
        mutate(formData)
    }

    return (
        <>
            <h1 className="text-3xl mb-2">Request password code</h1>
            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className="bg-white p-4 rounded shadow-md"
                noValidate
            >
                <div className="flex flex-col">
                    <label className="text-2xl">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="border border-gray-300 p-2 rounde-md mb-2"
                        {...register('email',{
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email format'
                            }
                        })}
                    />
                    {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )} 
                </div>

                <input
                    type="submit"
                    value="Request Code"
                    className="w-full bg-amber-600 text-white p-2 rounded cursor-pointer hover:bg-amber-700 transition-colors mt-2"
                />
            </form>

            <div className="flex justify-center mt-3">
                <Link to="/auth">
                    Log in
                </Link>
            </div>

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
