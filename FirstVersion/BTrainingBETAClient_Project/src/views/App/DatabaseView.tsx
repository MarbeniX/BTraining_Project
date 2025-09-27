import { getAllExercises } from "@/services/ExerciseService";
import { useQuery } from "@tanstack/react-query"
import DatabaseExercise from "@/components/app/dataBaseExercisComp";
import { useState } from "react";
import CreateNewExerciseForm from "@/components/forms/CreateNewExerciseForm"

export default function DatabaseView() {
    const [createExercise, setCreateExercise] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['exercises'],
        queryFn: getAllExercises
    })

    if(isLoading) return <div className="p-4">Loading...</div>
    if(isError) return <div className="p-4 text-red-500">Error loading exercises</div>
    if(data)return (
        <>
            <div className="flex flex-col p-4 space-y-8 h-full relative bg-gray-300">
                <div className="flex justify-between">
                    <h2 className="text-2xl">
                        Exercise Database
                    </h2>

                    <button 
                        className="flex items-center cursor-pointer bg-gray-400 hover:bg-gray-500 rounded-md p-3 gap-3"
                        onClick={() => setCreateExercise(true)}
                    >
                        <div className="w-7 h-7 rounded-full bg-amber-500"/>
                        Create new exercise
                    </button>
                </div>

                {data && data.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {data.map((exercise) => (
                            <DatabaseExercise
                                key={exercise.id}
                                exercise={exercise}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Add exercises</p>
                )}
            </div>

            {createExercise && (
                <CreateNewExerciseForm
                    isOpen={createExercise}
                    onConfirm={() => setCreateExercise(false)}
                    onCancel={() => setCreateExercise(false)}
                />
            )}
        </>
    )
}
