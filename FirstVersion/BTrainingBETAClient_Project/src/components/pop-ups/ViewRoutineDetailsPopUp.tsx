import { routineCategoryArray, type Routine, type RoutineUpdateForm } from "@/types/routineTypes";
import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import ExerciseComp from "@/components/app/exerciseComp"
import { useRoutineFormStore } from "@/stores/routineStore";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoutineById, removeExerciseFromRoutine } from "@/services/RoutineService";
import { toast, ToastContainer } from "react-toastify";
import type { Exercise } from "@/types/exerciseTypes";

type ViewRoutineDetailsPopUpProps = {
    isOpen: boolean;
    data: Routine['id']
}

export default function ViewRoutineDetailsPopUp({ isOpen, data }: ViewRoutineDetailsPopUpProps) {
    if (!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null;
    if( !container) return null;

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    const { register, handleSubmit, formState: { errors } } = useForm<RoutineUpdateForm>()

    const { data: routineData, refetch } = useQuery({
        queryKey: ['routine', data],
        queryFn: () => getRoutineById(data),
        enabled: !!data
    })

    const queryClient = useQueryClient();

    const handleEditRoutine = (formData: RoutineUpdateForm) => {
        setUpdateRotuineFormData(data, formData)
    }

    const { mutate: mutateRemoveExercise} = useMutation({
        mutationFn: removeExerciseFromRoutine,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['my-routines'] });
            refetch();
        }
    })
    const handleRemoveExercise = (exerciseId: Exercise['id']) => {
        mutateRemoveExercise({idRoutine: data, idExercise: exerciseId})
    }

    const editMode = useRoutineFormStore((state) => state.editMode)

    const setShowViewRoutineDetails = useRoutineFormStore((state) => state.setShowViewRoutineDetails)
    const setShowDeleteRoutineConfrmationForm = useRoutineFormStore((state) => state.setShowDeleteRoutineConfrmationForm)
    const setShowAddExerciseForm = useRoutineFormStore((state) => state.setShowAddExerciseForm)
    const setShowSaveChangesConfirmationForm = useRoutineFormStore((state) => state.setShowSaveChangesConfirmationForm)
    const setUpdateRotuineFormData = useRoutineFormStore((state) => state.setUpdateRoutineFormData)
    const setEditMode = useRoutineFormStore((state) => state.setEditMode)

    if(routineData)return(
        <>
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-screen"
            >
                <form 
                    onSubmit={handleSubmit(handleEditRoutine)}
                    className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-lg animate-fade-in flex flex-col space-y-4"
                    noValidate
                >
                    <div className="flex justify-between items-center">
                        {editMode ? (
                            <div className="flex flex-col space-y-2 w-full">
                                <input
                                    id="name"
                                    type="text"
                                    defaultValue={routineData.data.name}
                                    placeholder="Enter routine name"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("name", {
                                        required: "Routine name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Routine name must be at least 3 characters long"
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: "Routine name must be at most 10 characters long"
                                        }
                                    })}
                                /> 
                                {errors.name && (
                                    <span className="text-red-500">{errors.name.message}</span>
                                )}
                            </div>
                        ) : (
                            <h2 className="text-2xl">{routineData.data.name}</h2>
                        )}

                        <div className="relative inline-block text-left justify-between items-center" ref={menuRef}>
                            <CiMenuKebab
                                className="cursor-pointer text-2xl"
                                onClick={() => setMenuOpen((prev) => !prev)}    
                            />

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                                        {editMode ? (
                                            <>
                                                <button
                                                    className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() => {
                                                        setEditMode(false)
                                                        setMenuOpen(false)
                                                    }}
                                                >
                                                    Go back
                                                </button>
                                                <button
                                                    className="cursor-pointe block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() => {
                                                        setShowDeleteRoutineConfrmationForm(true)
                                                        setMenuOpen(false)
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() => {
                                                        setEditMode(true)
                                                        setMenuOpen(false)
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="cursor-pointe block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() => {
                                                        setShowDeleteRoutineConfrmationForm(true)
                                                        setMenuOpen(false)
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p>{routineData.data.creationDate}</p>

                        {editMode ? (
                            <select
                                id="category"
                                defaultValue={routineData.data.category}
                                className="p-2 border border-gray-300 rounded-lg"
                                {...register('category')}
                            >
                                <option value=''>{routineData.data.category}</option>
                                {routineCategoryArray.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >{category}</option>
                                ))}
                            </select>
                        ) : (
                            <p>{routineData.data.category}</p>
                        )}
                    </div>

                    {editMode ? (
                        <>
                            <input
                                id="description"
                                type="text"
                                defaultValue={routineData.data.description} 
                                placeholder="Hard as a rock, easy as a pie"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("description", {
                                    maxLength: {
                                        value: 40,
                                        message: "Description must be at most 40 characters long"
                                    }
                                })}
                            />
                            {errors.description && (
                                <span className="text-red-500">{errors.description.message}</span>
                            )} 
                        </>
                    ) : (
                        <p className="break-words whitespace-normal">{routineData.data.description}</p>
                    )}

                    <label className="text-2xl">Exercises</label>
                    <div className="space-y-3 overflow-y-auto pr-2 flex flex-col">
                        {Array.isArray(routineData.data.exercises) && routineData.data.exercises.length > 0 ? (
                            routineData.data.exercises.map((exercise) => (
                                <ExerciseComp 
                                    key={exercise.id} 
                                    data={exercise} 
                                    editMode={editMode}
                                    onDelete={() => handleRemoveExercise(exercise.id)}
                                />
                            ))
                            ) : (
                            <p className="mt-auto">No exercises in this routine</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <button
                            type="button"
                            className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg w-full"
                            onClick={() => {
                                setShowViewRoutineDetails(false)
                                setEditMode(false)
                            }}
                        >
                            Close
                        </button>
                        {editMode ? (
                            <>
                                <button
                                    type="button"
                                    className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg w-full"
                                    onClick={() => {
                                        setShowAddExerciseForm(true)
                                    }}
                                >Add new exercises</button>

                                <input
                                    type="submit"
                                    value="Save Changes"
                                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg w-full"
                                    onClick={() => {
                                        setShowSaveChangesConfirmationForm(true)
                                    }}
                                />
                            </>
                        ) : (
                            <button
                                type="button"
                                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg w-full"
                            >
                                Start Session
                            </button>            
                        )}
                    </div>
                </form>

            </div>

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
