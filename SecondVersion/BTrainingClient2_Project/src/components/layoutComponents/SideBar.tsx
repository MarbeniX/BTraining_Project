import { NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaClockRotateLeft } from "react-icons/fa6";
import { LuBicepsFlexed } from "react-icons/lu";
import { FaRegListAlt } from "react-icons/fa";

const buttons = [
    { name: "Home", icon: GoHomeFill, to: "/" },
    { name: "My routines", icon: FaRegListAlt, to: "/my-routines" },
    { name: "My activity", icon: FaClockRotateLeft, to: "/my-activity" },
    { name: "Train", icon: LuBicepsFlexed, to: "/train" },
];
export default function SideBar() {
    return (
        <nav className="h-full flex flex-col justify-center">
            <ul className="text-2xl text-white space-y-2 ml-5">
                {buttons.map((button) => (
                    <li key={button.name}>
                        <NavLink
                            to={button.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-l-2xl transition-all gap-2 
                                ${
                                    isActive
                                        ? "bg-gray-800"
                                        : "hover:bg-gray-800"
                                }`
                            }
                        >
                            <button.icon className="text-2xl" />
                            {button.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
