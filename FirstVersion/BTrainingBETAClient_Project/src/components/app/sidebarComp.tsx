import { useRoutineFormStore } from "@/stores/routineStore"
import type { AuthGetUser } from "@/types/authTypes"
import { Link } from "react-router-dom"

type SideBarProps = {
    data: AuthGetUser['admin']
}

export default function sidebarComp({data} : SideBarProps) {

    const links = [
        { name: "Home", path: ""},
        { name: "My routines", path: "/my-routines", onclick: () => setAdminPage(false) },
        { name: "My activity", path: "/my-activity", onclick: () => setAdminPage(false) },
        { name: "Train", path: "/train", onclick: () => {
            setAdminPage(false)
            setShowHowDoYouWantToTrain(true)
            setRoutineNameAndIdTraining('', '')
        } },
    ]

    const adminLinks = data? 
        [
            { name: "Admin profile", path: "/admin/admin-profile", onclick: () => setAdminPage(true) },
            { name: "Database", path: "/admin/database", onclick: () => setAdminPage(true) },
        ]
    : [];

    const setAdminPage = useRoutineFormStore((state) => state.setAdminPage)
    const setShowHowDoYouWantToTrain = useRoutineFormStore((state) => state.setShowHowDoYouWantToTrain)
    const setRoutineNameAndIdTraining = useRoutineFormStore((state) => state.setRoutineNameAndIdTraining)

    return (
        <>
            <aside className="bg-gray-500 w-full h-screen text-white flex flex-col justify-center">
                <nav className="flex flex-col space-y-3 ml-5">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-lg px-4 py-2 rounded hover:bg-gray-700 transition ${
                                location.pathname === link.path ? "bg-gray-700" : ""
                            }`}               
                            onClick={link.onclick}             
                        >
                            {link.name}
                        </Link>
                    ))}

                    {adminLinks.length > 0 && (
                        <div className="border-t border-gray-600 w-4/5"/>
                    )}

                    {adminLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-lg px-4 py-2 rounded hover:bg-blue-700 transition ${
                                location.pathname === link.path ? "bg-blue-700" : ""
                            }`}
                            onClick={link.onclick}                            
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    )
}
