import type { ExerciseReceive } from "@/types/exerciseTypes"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import ConfirmationMessage1 from "@/components/messages/confirmation_message"
import { deleteExeciseById } from "@/services/ExerciseService"
import { toast, ToastContainer } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import ViewExerciseDettailsPopUp from "@/components/pop-ups/ViewExerciseDetailsPopUp"

type dataBaseExerciseCompProps = {
    exercise: ExerciseReceive
}

export default function dataBaseExercisComp({exercise} : dataBaseExerciseCompProps) {
    const [showDeleteExerciseConfirmation, setShowDeleteExerciseConfirmation] = useState(false);
    const [showEditExerciseForm, setShowEditExerciseForm] = useState(false);

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: deleteExeciseById, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            setShowDeleteExerciseConfirmation(false)
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
        }
    })
    const handleDeleteExercise = () => {
        mutate(exercise.id)
    }

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-purple-300 rounded-lg shadow-md w-full">
                <div className="w-3/12 flex justify-center">{exercise.id}</div>
                <div className="w-1/12 flex justify-center">
                    <img src={exercise.imageURL} alt={exercise.title} />
                </div>
                <div className="w-2/12 flex justify-center">{exercise.title}</div>
                <div className="w-1/12 flex justify-center">{exercise.muscle}</div>
                <div className="w-1/12 flex justify-center">{exercise.difficulty}</div>
                <div className="w-3/12 flex justify-center">{exercise.description}</div>
                <div className="w-1/12 flex justify-center gap-2">
                    <button 
                        type="button"
                        className="cursor-pointer p-4 bg-blue-500 hover:bg-blue-600 rounded-full"
                        onClick={() => setShowEditExerciseForm(true)}
                    />

                    <button 
                        type="button"
                        className="cursor-pointer p-4 bg-red-500 hover:bg-red-600 rounded-full"
                        onClick={() => setShowDeleteExerciseConfirmation(true)}
                    />
                </div>
            </div>

            {showDeleteExerciseConfirmation && (
                <ConfirmationMessage1
                    isOpen={showDeleteExerciseConfirmation}
                    title="Are you sure you waqnt to delete this exercise?"
                    message="Once saved, the changes will be applied permanently"
                    onConfirm={handleDeleteExercise}
                    onCancel={() => setShowDeleteExerciseConfirmation(false)}
                />
            )}

            {showEditExerciseForm && (
                <ViewExerciseDettailsPopUp
                    isOpen={showEditExerciseForm}
                    onClose={() => setShowEditExerciseForm(false)}
                    exerciseId={exercise.id}
                />
            )}

            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}
