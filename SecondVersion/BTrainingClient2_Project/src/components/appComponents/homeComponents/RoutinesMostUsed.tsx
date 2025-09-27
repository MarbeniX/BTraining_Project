import { useState } from "react";
import { Link } from "react-router-dom";
import RoutineSummary from "@/components/appComponents/homeComponents/RoutineSummary";
import RoutineExerciseNav from "@/components/appComponents/homeComponents/RoutineExerciseNav";

const mostUsedButtons = [{ label: "Routines" }, { label: "Exercises" }];

export default function RoutinesMostUsed() {
    const [activeButton, setActiveButton] = useState<string>(
        mostUsedButtons[0].label
    );

    return (
        <div className="flex flex-col flex-1 gap-5 items-center">
            <h2 className="text-white text-3xl">Most used</h2>

            <RoutineExerciseNav
                activeButton={activeButton}
                setActiveButton={setActiveButton}
                mostUsedButtons={mostUsedButtons}
            />

            {activeButton === "Routines" && (
                <div className="flex flex-col ">
                    <div className="flex gap-4">
                        <RoutineSummary />
                    </div>

                    <div className="flex justify-center">
                        <Link
                            to={"/train"}
                            className="text-white tracking-widest font-light hover:bg-gray-600 p-3 rounded-xl border text-xs"
                        >
                            View all routines
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
