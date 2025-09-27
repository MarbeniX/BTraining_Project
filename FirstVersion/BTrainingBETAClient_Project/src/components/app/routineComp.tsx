import type { Routine } from "@/types/routineTypes"
import ExerciseComp from "@/components/app/exerciseComp"
import { CiMenuKebab } from "react-icons/ci";
import { useState, useEffect, useRef } from "react"
import { useRoutineFormStore } from "@/stores/routineStore";
import { useNavigate } from "react-router-dom";

type routineCompProps = {
    data: Routine,
    onDelete: () => void,
    onViewRoutine: () => void
}

export default function routineComp({data, onDelete, onViewRoutine} : routineCompProps) {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const setEditMode = useRoutineFormStore((state) => state.setEditMode)
    const setShowViewRoutineDetails = useRoutineFormStore((state) => state.setShowViewRoutineDetails)
    const setRoutineNameAndIdTraining = useRoutineFormStore((state) => state.setRoutineNameAndIdTraining)
    const setModeHowDoYouWantToTrain = useRoutineFormStore((state) => state.setModeHowDoYouWantToTrain)

    return (
        <>
            <div className="bg-gray-400 flex flex-col rounded-md p-5 shadow-md space-y-3 h-70">
                <div className="space-y-2 w-full max-w-80">
                    <div className="flex justify-between">
                        <h2 className="text-2xl">{data.name}</h2>

                        <div className="relative inline-block text-left" ref={menuRef}>
                            <CiMenuKebab
                                className="cursor-pointer text-2xl"
                                onClick={() => setIsOpen((prev) => !prev)}
                            />

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                                    <button
                                        className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setEditMode(true);
                                            setShowViewRoutineDetails(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            onDelete();
                                            setIsOpen(false);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <p>{data.creationDate}</p>
                        <p>{data.category}</p>
                    </div>

                    <p className="break-words whitespace-normal">{data.description}</p>
                </div>

                <div className="space-y-3 overflow-y-auto pr-2 flex flex-col">
                    {Array.isArray(data.exercises) && data.exercises.length > 0 ? (
                        data.exercises.map((exercise) => (
                            <ExerciseComp key={exercise.id} data={exercise} />
                        ))
                        ) : (
                        <p className="mt-auto">No exercises in this routine</p>
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        onClick={() => {onViewRoutine()}}
                    >View Routine</button>

                    <button
                        className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        onClick={() => {
                            setRoutineNameAndIdTraining(data.id, data.name);
                            setModeHowDoYouWantToTrain(true);
                            navigate('/train')
                        }}
                    >
                        Start session
                    </button>
                </div>
            </div>
        </>
    )
}
