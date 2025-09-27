import { toast, ToastContainer } from "react-toastify"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { confirmAccount } from "@/services/AuthService"
import type { TokenConfirmAccountForm } from "@/types/tokenTypes"
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function ConfirmAccountView() {
    const [ token, setToken] = useState<TokenConfirmAccountForm['token']>('');

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setTimeout(() => {
                navigate('/auth');
            }, 1000); // Espera 1 segundo antes de navegar
        }
    })

    const handleChange = (token: TokenConfirmAccountForm['token']) => {
        setToken(token);
    }

    const handleComplete = (token: TokenConfirmAccountForm['token']) => {
        mutate(token);
    }

    return (
        <>
            <h1 className="text-3xl">Confirm Account</h1>
            <form
                className="bg-white p-4 rounded-md shadow-md"
                noValidate
            >
                <div className="flex flex-col gap-4">
                    <label className="text-2xl">Token</label>
                    <div className="flex justify-center gap-5">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-whilte"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-whilte"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-whilte"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-whilte"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-whilte"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-whilte"/>
                    </PinInput>
                    </div>
                </div>
            </form>

            <nav className="mt-3 justify-center flex">
                <Link
                    to="/auth/request-code"
                    className=""
                >Didn't you get the code?</Link>
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
