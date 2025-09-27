import { Outlet } from "react-router-dom"
import { userAuth } from "@/hooks/userAuth";
import { Navigate } from "react-router-dom";
import Sidebar from "@/components/app/sidebarComp";
import { IoIosArrowDown } from "react-icons/io";
import { useRoutineFormStore } from "@/stores/routineStore";
import ConfirmationMessage from "@/components/messages/confirmation_message"
import ConfirmationMessage2 from "@/components/messages/confirmation_message2"
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteRoutineById, updateRoutine } from "@/services/RoutineService";
import { toast, ToastContainer } from "react-toastify";
import type { Routine } from "@/types/routineTypes";
import ViewRoutineDetailsPopUp from "@/components/pop-ups/ViewRoutineDetailsPopUp";
import SearchExercisesBarForm from "@/components/forms/SearchExercisesBarForm";

export default function AppLayout() {
    const { data, isLoading, isError } = userAuth();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteRoutineById,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['routines'] });
            queryClient.invalidateQueries({ queryKey: ['my-routines'] });
        }
    })
    const handleConfirmDeleteRoutine = (formData: Routine['id']) => {
        setShowDeleteRoutineConfirmationForm(false);
        mutate(formData);
    }

    const { mutate: mutateUpdateRoutine } = useMutation({
        mutationFn: updateRoutine,
        onError: (error) => {
            toast.error(error.message);
        }, 
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['my-routines'] });
            queryClient.invalidateQueries({ queryKey: ['routiones'] });
            queryClient.invalidateQueries({ queryKey: ['routine', routineId] });
        }
    })
    const handleConfirmUpdateRoutine = () => {
        if(routineId && updateRoutineFormData){
            mutateUpdateRoutine({id: routineId, formData: updateRoutineFormData})
            setShowSaveChangesConfirmationForm(false)
            setShowViewRoutineDetails(false)
        }
    }

    const routineId = useRoutineFormStore((state) => state.routineId)
    const showDeleteRoutineConfirmationForm = useRoutineFormStore((state) => state.showDeleteRoutineConfrmationForm)
    const showViewRoutineDetails = useRoutineFormStore((state) => state.showViewRoutineDetails)
    const showAddExerciseForm = useRoutineFormStore((state) => state.showAddExerciseForm)
    const showSaveChangesConfirmationForm = useRoutineFormStore((state) => state.showSaveChangesConfirmationForm)
    const updateRoutineFormData = useRoutineFormStore((state) => state.updateRoutineFormData)
    const adminPage = useRoutineFormStore((state) => state.adminPage)

    const setShowDeleteRoutineConfirmationForm = useRoutineFormStore((state) => state.setShowDeleteRoutineConfrmationForm)
    const setShowSaveChangesConfirmationForm = useRoutineFormStore((state) => state.setShowSaveChangesConfirmationForm)
    const setShowViewRoutineDetails = useRoutineFormStore((state) => state.setShowViewRoutineDetails)
        

    if(isLoading) return <p>Cargando...</p>
    if(isError) return <Navigate to="/auth" replace/>
    
    if(data) return (
        <>
            <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white">
                <Sidebar data={data.admin} />
            </div>
            
            <div className="ml-64 h-screen flex flex-col">
                <header className="bg-gray-100 p-4 flex items-center justify-between h-auto">
                    {adminPage ? (
                        <div className="text-xl font-semibold text-black">
                            <h1>Hi admin</h1>
                        </div>
                    ) : (
                        <div className="text-xl font-semibold text-black">
                            <h1>Hi, what are we doing today?</h1>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                            <label>{data.username}</label>
                            <IoIosArrowDown/>
                        </div>
                    </div>
                </header>

                <main className="p-6 bg-gray-100 h-full">
                    <Outlet />
                </main>
            </div>

            {showDeleteRoutineConfirmationForm && (
                <ConfirmationMessage
                    isOpen={showDeleteRoutineConfirmationForm}
                    title="Are you sure you want ot delete this routine?"
                    message="Al information related to this routine will be deleted and cannot be recovered."
                    onConfirm={() => handleConfirmDeleteRoutine(routineId!)}
                    onCancel={() => setShowDeleteRoutineConfirmationForm(false)}
                />
            )}

            {showSaveChangesConfirmationForm && (
                <ConfirmationMessage2
                    isOpen={showSaveChangesConfirmationForm}
                    title="Are you sure you want to save changes?"
                    message="Once saved, the changes will be applied permanently"
                    onConfirm={handleConfirmUpdateRoutine}
                    onCancel={() => setShowSaveChangesConfirmationForm(false)}
                />
            )}
            
            {showViewRoutineDetails && (
                <ViewRoutineDetailsPopUp
                isOpen={showViewRoutineDetails}
                data={routineId!}
                />
            )}

            {showAddExerciseForm && (
                <SearchExercisesBarForm
                    isOpen={showAddExerciseForm}
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
