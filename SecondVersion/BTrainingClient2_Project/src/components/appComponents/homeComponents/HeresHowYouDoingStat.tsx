import type { StatItemType } from "@/types";

type HeresHowYouDoingStatProps = {
    stat: StatItemType;
};

export default function HeresHowYouDoingStat({
    stat,
}: HeresHowYouDoingStatProps) {
    return (
        <div className="flex flex-1 text-white bg-gray-600 rounded-xl p-4 items-center justify-between">
            <div className="flex flex-col gap-2">
                <p className="font-light tracking-widest">{stat.label}</p>
                <p>
                    <span className="text-5xl">{stat.value}</span>
                    <span className="font-light tracking-widest">
                        {" "}
                        {stat.subText && stat.subText}
                    </span>
                </p>
            </div>

            <span className="text-4xl rounded-full bg-[#B4D6FD] text-[#033C7C] p-2">
                {stat.icon && <stat.icon />}
            </span>
        </div>
    );
}
