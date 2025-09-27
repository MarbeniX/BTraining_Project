import { FaRegImage } from "react-icons/fa";

export default function RoutineSummaryExercise() {
    return (
        <div className="flex w-full gap-2 bg-gray-600 p-2 items-center rounded-xl">
            <FaRegImage className="text-6xl" />
            <div className="flex flex-col gap-1">
                <p>Pause Squads</p>
                <div className="flex gap-2">
                    <p className="tracking-widest font-light text-[#021D1A] bg-[#0BA391] px-3 py-1 rounded-md">
                        Leg
                    </p>
                    <p className="tracking-widest font-light text-white bg-[#825A9B] px-3 py-1 rounded-md">
                        Beginner 2
                    </p>
                </div>
            </div>
        </div>
    );
}
