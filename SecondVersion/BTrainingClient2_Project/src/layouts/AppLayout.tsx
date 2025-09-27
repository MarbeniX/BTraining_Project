import { Outlet } from "react-router-dom";
import SideBar from "@/layoutComponents/SideBar";
import TopBar from "@/layoutComponents/TopBar";

export default function AppLayout() {
    return (
        <div className="flex h-screen">
            {" "}
            <aside className="w-60 bg-gray-700">
                <SideBar />
            </aside>
            <div className="flex flex-col flex-1 bg-gray-800">
                <TopBar />

                <Outlet />
            </div>
        </div>
    );
}
