import { toast, ToastContainer } from "react-toastify"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { updatePassword } from "@/services/AuthService"
import type { AuthUpdatePasswordForm } from "@/types/authTypes"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

export default function ResetPasswordView() {
    const initialValues = {
        password: '',
        passwordConfirm: ''
    }

    const { token } = useParams()
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: updatePassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
        }
    })

    const handleUpdatePassword = (formData : AuthUpdatePasswordForm) => {
        if (!token) {
            toast.error("Invalid or missing token.");
            return;
        }
        mutate({formData, token})
    }

    return (
        <>
            <h1 className="text-3xl">Update your password</h1>
            <form
                onSubmit={handleSubmit(handleUpdatePassword)}
                className="bg-white rounded-md shadow-md p-4 mt-3"
            >
                <div className="flex flex-col p-2">
                    <label className="text-2xl">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="border border-gray-300 rounded-md p-2"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                    />
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
                </div>

                <div className="flex flex-col p-2">
                    <label className="text-2xl">Confirm password</label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        className="border border-gray-300 rounded-md p-2"
                        {...register("passwordConfirm", {
                            required: "Password confirmation is required",
                            validate: (value, formValues) => {
                                if(value !== formValues.password) {
                                    return "Passwords do not match";
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
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md cursor-pointer mt-2"
                    value="Update Password"
                />
            </form>

            <div className="flex justify-center mt-4">
                <Link to="/auth">
                    Log in
                </Link>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
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
