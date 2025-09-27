import ReadyToSweat from "@/components/appComponents/homeComponents/ReadyToSweat";
import HeresHowYouDoing from "@/components/appComponents/homeComponents/HeresHowYouDoing";
import RoutinesMostUsed from "@/components/appComponents/homeComponents/RoutinesMostUsed";

export default function Home() {
    return (
        <div className="mx-7 flex flex-col">
            <header className="text-white font-bold text-4xl">
                Hi, <span className="text-[#FFB27A]">User</span>!
            </header>

            <main className="flex flex-col gap-7 mt-7">
                <section className="flex gap-4">
                    <ReadyToSweat />
                    <HeresHowYouDoing />
                </section>

                <section>
                    <RoutinesMostUsed />
                </section>
            </main>
        </div>
    );
}
