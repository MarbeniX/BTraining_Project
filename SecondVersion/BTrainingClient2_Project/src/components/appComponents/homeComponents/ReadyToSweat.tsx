import { FaRegListAlt } from "react-icons/fa";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const buttons = [
    {
        name: "Routine",
        icon: FaRegListAlt,
        to: "/train",
        style: "bg-[#DEFA41] text-[#333C02]",
    },
    {
        name: "Free",
        icon: IoExtensionPuzzleOutline,
        to: "/train",
        style: "bg-[#B4D6FD] text-[#033C7C]",
    },
];

export default function ReadyToSweat() {
    return (
        <div className="flex flex-col w-100 h-auto items-center justify-center text-white bg-gray-900 rounded-xl gap-2 p-5">
            <h1 className="text-3xl p-5">Ready to sweat?</h1>
            <p>Choose your workout style for today and let's get moving!</p>
            <nav className="flex w-full gap-4 py-3 justify-center">
                {buttons.map((button) => (
                    <Link
                        key={button.name}
                        to={button.to}
                        className={`flex gap-2 rounded-xl p-3 transition-all w-full justify-center items-center ${
                            button.style
                        }
                        ${
                            button.name === "Routine"
                                ? "bg-[#DEFA41] text-[#333C02] hover:bg-[#C7E600] hover:text-[#222A01]"
                                : "bg-[#B4D6FD] text-[#033C7C] hover:bg-[#7EC3F7] hover:text-[#022B57]"
                        }`}
                    >
                        <button.icon className="text-2xl" />
                        {button.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
