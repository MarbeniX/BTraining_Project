import { createAccount } from "@/services/AuthService"
import type { AuthCreateAccountForm } from "@/types/authTypes"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

export default function RegisterView() {
    const initialValues = {
        email: '',
        username: '',
        password: '',
        passwordConfirm: ''
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createAccount, 
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
    })

    const { register, handleSubmit, formState: { errors }} = useForm({defaultValues: initialValues});

    const handleRegister = (formData: AuthCreateAccountForm) => {
        mutate(formData)
    }

    return (
        <>
            <h1 className="text-3xl mb-2">Register</h1>
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white p-4 rounded-md shadow-md"
                noValidate
            >
                <div className="flex flex-col gap-4">
                    <label className="text-2xl">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="border border-gray-300 rounded-md p-2"
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
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <label className="text-2xl">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="border border-gray-300 rounded-md p-2"
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                                value: 3,
                                message: 'Username must be at least 3 characters long'
                            }
                        })}
                    />
                    {errors.username && (
                        <span className="text-red-500">{errors.username.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <label className="text-2xl">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="border border-gray-300 rounded-md p-2"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8, 
                                message: 'Password must be at least 8 characters long'
                            }
                        })}
                    />
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
                </div>
                
                <div className="flex flex-col gap-4 mt-2">
                    <label className="text-2xl">Confirm password</label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        className="border border-gray-300 rounded-md p-2"
                        {...register('passwordConfirm', {
                            required: 'Password confirmation is required',
                            validate: (value, formValues) => {
                                if(value !== formValues.password) {
                                    return 'Passwords do not match';
                                }
                            }
                        })}
                    />
                    {errors.passwordConfirm && (
                        <span className="text-red-500">{errors.passwordConfirm.message}</span>
                    )}
                </div>

                <input
                    type="submit"
                    value='Register'
                    className='w-full mt-2 p-2 bg-amber-600 rounded-md hover:bg-amber-700 cursor-pointer'    
                />
            </form>
            
            {isPending ? (
                <div className="mt-3 text-center">
                    <span>Loading...</span>
                </div>
            ) : (
                <nav className="mt-3 text-center">
                    <Link to={'/auth'}>Log in</Link>
                </nav>
            )}


            
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
