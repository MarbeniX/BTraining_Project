import { useState } from "react";
import { RiImageCircleFill } from "react-icons/ri";

export default function TopBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex justify-end m-6">
            <button
                className={`flex items-center gap-4 rounded-xl p-3 cursor-pointer transition-all
                    ${isOpen ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <RiImageCircleFill className="text-3xl" />
                <span className="text-white text-2xl">Name Lastname</span>
            </button>
        </header>
    );
}
