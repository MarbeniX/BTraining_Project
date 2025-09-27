import { type TrainingSessionExerciseComp } from "@/types/trainingSessionTypes";
import { useState } from "react";

type TrainingSessionExerciseCompProps = {
    exercise: TrainingSessionExerciseComp;
    index: number;
    isEditingMark: boolean;
    onDelete: () => void;
    onEdit: (setNumber: number, reps: number) => void;
}

export default function trainingSessionExerciseComp({ exercise, index, isEditingMark, onDelete, onEdit}: TrainingSessionExerciseCompProps) {
    const [setNumber, setSetNumber] = useState(exercise.setNumber);
    const [reps, setReps] = useState(exercise.reps);

    const formatTime = (ms: number): string => {
        const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
        const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
        return `${minutes}:${seconds}:${centiseconds}`;
    };

    return (
        <>
            <div className="grid grid-cols-6 items-center justify-items-center w-full p-2 border-b border-gray-200 ">
                <p>{index}</p>
                <p>{formatTime(exercise.timeToComplete)}</p>
                <p>{exercise.title}</p>

                {isEditingMark ? (
                    <input
                        type="number"
                        className="w-1/2 bg-white border border-gray-300 rounded-md p-1"
                        value={setNumber}
                        onChange={(e) => setSetNumber(Number(e.target.value))}
                    />
                ) : (
                    <p>{setNumber}</p>
                )}

                {isEditingMark ? (
                    <input
                        type="number"
                        className="w-1/2 bg-white border border-gray-300 rounded-md p-1"
                        value={reps}
                        onChange={(e) => setReps(Number(e.target.value))}
                    />
                ) : (
                    <p>{reps}</p>
                )}

                <div className="flex gap-2">
                    <button
                        className="cursor-pointer w-7 h-7 bg-blue-500 rounded-full"
                        onClick={() => onEdit(setNumber, reps)}
                    />

                    <button
                        className="cursor-pointer w-7 h-7 bg-red-500 rounded-full"
                        onClick={onDelete}
                    />
                </div>
            </div>
        </>
    )
}
