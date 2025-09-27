import HereHowYouDoingStat from "@/components/appComponents/homeComponents/HeresHowYouDoingStat";
import { RiCalendar2Line } from "react-icons/ri";
import { LuDumbbell } from "react-icons/lu";
import { GrGamepad } from "react-icons/gr";
import type { StatItemType } from "@/types";

const stats: StatItemType[] = [
    {
        label: "Workouts this week",
        value: 3,
        subText: "times",
        icon: RiCalendar2Line,
    },
    {
        label: "Total trainings",
        value: 7,
        subText: "times",
        icon: LuDumbbell,
    },
    {
        label: "Most common level",
        value: "B1",
        subText: null,
        icon: GrGamepad,
    },
];

export default function HeresHowYouDoing() {
    return (
        <div className="flex flex-col flex-1 justify-center gap-5 py-5 px-7 rounded-xl bg-gray-700">
            <h1 className="text-3xl text-white">Here's how you're doing</h1>
            <main className="flex gap-4">
                {stats.map((stat) => (
                    <HereHowYouDoingStat key={stat.label} stat={stat} />
                ))}
            </main>
        </div>
    );
}
