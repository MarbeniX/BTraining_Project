import { login } from '@/services/AuthService';
import type { AuthLoginForm } from '@/types/authTypes';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginView() {
    const initialValues = {
        email: '',
        password: '',
    }

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    })

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const handleLogin = (formData: AuthLoginForm) => {
        mutate(formData);
    }

    return (
        <>
            <h1 className='text-3xl mb-2'>Log in</h1>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className='bg-white p-4 rounded-md shadow-md'
                noValidate
            >
                <div className='flex flex-col gap-4'>
                    <label className='text-2xl'>Email</label>
                    <input
                        id = 'email'
                        type='email'
                        className='border border-gray-300 rounded-md p-2'
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    {errors.email && (
                        <span className='text-red-500'>{errors.email.message}</span>)}
                </div>

                <div className='flex flex-col gap-4'>
                    <label className='text-2xl'>Password</label>
                    <input
                        id='password'
                        type='password'
                        className='border border-gray-300 rounded-md p-2'
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long'
                            }
                        })}
                    />
                    {errors.password && (
                        <span className='text-red-500'>{errors.password?.message}</span>
                    )}
                </div>

                <input 
                    type="submit" 
                    value='Log in'
                    className='w-full mt-2 p-2 bg-amber-600 rounded-md hover:bg-amber-700 cursor-pointer'    
                />
            </form>

            <nav className='mt-3 flex flex-col space-y-2 text-center'>
                <Link
                    to={'/auth/register'}
                >Don't you have an account? Register</Link>

                <Link
                    to={'/auth/request-password-code'}
                >Do you forget your password?</Link>
            </nav>

            <ToastContainer
                position='top-right'
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
