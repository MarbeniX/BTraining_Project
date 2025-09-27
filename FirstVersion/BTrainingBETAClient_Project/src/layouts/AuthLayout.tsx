import { Outlet } from "react-router-dom";

export default function () {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
            <div className="py-10 lg-py-20 mx-auto w-[450px]">
                <h1 className="text-2xl font-bold mb-4 text-center">Welcome to ClockT</h1>
                <div className="mt-10"> 
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
