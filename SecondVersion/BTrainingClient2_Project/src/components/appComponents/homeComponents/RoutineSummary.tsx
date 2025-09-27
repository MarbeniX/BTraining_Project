import { HiDotsHorizontal } from "react-icons/hi";
import RoutineSummaryExercise from "@/components/appComponents/homeComponents/RoutineSummaryExercise";
import { NavLink } from "react-router-dom";

export default function RoutineSummary() {
    return (
        <div className="flex rounded-xl bg-gray-700 text-white w-1/3">
            <div className="w-3 bg-[#08786B] rounded-l-xl" />

            <main className="p-4">
                <div className="flex items-end justify-between mb-2">
                    <h3 className="tracking-widest font-light bg-[#08786B] px-3 py-1 rounded-md">
                        Leg
                    </h3>
                    <HiDotsHorizontal className="cursor-pointer" />
                </div>
                <h1 className="text-2xl">Leg Burner</h1>
                <p className="text-gray-500 tracking-widest font-light mt-1 mb-3">
                    11.06.25
                </p>
                <p>Squads, lunges and jumps. No gear, just grit.</p>

                <section className="flex flex-col w-full px-1 py-2 gap-1">
                    <RoutineSummaryExercise />
                    <RoutineSummaryExercise />
                </section>

                <NavLink
                    to={"/train"}
                    className="text-black font-normal tracking-widest bg-[#DEFA41] py-2 mt-1 rounded-xl inline-block text-center w-full hover:brightness-75 transition-all"
                >
                    Start session
                </NavLink>
            </main>
        </div>
    );
}
