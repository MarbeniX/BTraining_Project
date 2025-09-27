import type { Routine } from "@/types/routineTypes";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import ExercisComp from "@/components/app/exerciseComp"

type RoutineExercisesPopUpProps = {
    isOpen: boolean
    routine: Routine
    onClose: () => void
    setActualExerciseTraining: (exercise: { id: string, title: string }) => void
}

export default function RoutineExercisesPopUp({ isOpen, routine, onClose, setActualExerciseTraining }: RoutineExercisesPopUpProps) {
    if(!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null;
    if(!container) return null;
    
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-[60%] max-w-lg">
                    <div className="flex items-center justify-center">
                        <label className="text-2xl">Select an exercise</label>
                        <IoMdClose
                            className="text-2xl cursor-pointer ml-auto"
                            onClick={onClose}
                        />
                    </div>


                    <ul className="mt-4 flex flex-col space-y-2">
                        {routine.exercises.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="cursor-pointer hover:bg-gray-100 rounded-md"
                                onClick={() => onClose()}
                            >
                                <ExercisComp
                                    key={exercise.id}
                                    data={exercise}
                                    onClick={() => {
                                        setActualExerciseTraining({ id: exercise.id, title: exercise.title });
                                        onClose();
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>,
        container
    )
}
