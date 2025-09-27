type RoutinesMostUsedProps = {
    activeButton: string;
    setActiveButton: (label: string) => void;
    mostUsedButtons: { label: string }[];
};

export default function RoutineExerciseNav({
    activeButton,
    setActiveButton,
    mostUsedButtons,
}: RoutinesMostUsedProps) {
    return (
        <>
            <nav className="flex gap-1.5">
                {mostUsedButtons.map((button) => (
                    <button
                        key={button.label}
                        className={`
                                    text-md text-white font-light px-3 pt-3 rounded-t-xl tracking-widest transition-all cursor-pointer flex flex-col items-center
                                    ${
                                        activeButton === button.label
                                            ? "bg-gray-600"
                                            : "bg-gray-700 hover:bg-gray-600"
                                    }
                                `}
                        onClick={() => setActiveButton(button.label)}
                    >
                        {button.label}
                        <div className="flex-1" />
                        {activeButton === button.label && (
                            <div className="h-1 bg-[#0558B8] w-full rounded-t-xl mt-2" />
                        )}
                    </button>
                ))}
            </nav>
        </>
    );
}
