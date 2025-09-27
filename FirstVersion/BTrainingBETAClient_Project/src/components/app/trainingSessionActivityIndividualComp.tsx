import { generateSessionPDF } from "@/services/TrainingService"
import type { GetTrainingSessionById } from "@/types/trainingSessionTypes"
import formatReadableDate from "@/utils/formatDate"
import formatTime from "@/utils/formatTime"
import { useMutation } from "@tanstack/react-query"
import { toast, ToastContainer } from "react-toastify"

type TrainingSessionActivityIndividualCompProps = {
    trainingSession: GetTrainingSessionById
}

export default function trainingSessionActivityIndividualComp({ trainingSession }: TrainingSessionActivityIndividualCompProps) {
    const { mutate } = useMutation({
        mutationFn: generateSessionPDF, 
        onSuccess: () => {
            toast.success(`PDF generated successfully! Download it from`)
        }, 
        onError: (error) => {
            toast.error(`Error generating PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
    })
    const handleMakePDF = () => {
        mutate(trainingSession.sessionId)
    }

    return (
        <>
            <div className="flex justify-between border p-4 rounded-lg shadow-md bg-white items-center">
                <div className="flex flex-col space-y-2">
                    <p>{formatReadableDate(trainingSession.trainingDate)}</p>
                    <button>
                        <span className="text-blue-500 hover:underline cursor-pointer" onClick={handleMakePDF}>
                            Generate PDF
                        </span>
                    </button>
                </div>
                <p>{trainingSession.routineId}</p>
                
                <div className="grid grid-cols-2 gap-2">
                    {trainingSession.marks?.map((mark) => (
                        <div key={mark.markId} className="flex space-x-5 p-2 border rounded">
                            <p>Reps: {mark.reps}</p>
                            <p>Set: {mark.setNumber}</p>
                            <p>Time: {formatTime(mark.timeToComplete)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <ToastContainer/>
        </>
    )
}
