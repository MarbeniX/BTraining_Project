import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { routineCategoryArray, type RoutineCreateForm } from "@/types/routineTypes";
import { createRoutine } from "@/services/RoutineService";
import { toast, ToastContainer } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRoutineFormStore } from "@/stores/routineStore";

export const CreateNewRoutineForm = () => {
    const [addExercise, setAddExercise] = useState(false);  
    const { register, handleSubmit, formState: { errors } } = useForm<RoutineCreateForm>();
    
    const queryClient = useQueryClient();
    
    const { mutate } = useMutation({
        mutationFn: createRoutine,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
            setRoutineId(data.data);
            closeCreateRoutineForm();
            handleAddExerciseOption();
            queryClient.invalidateQueries({ queryKey: ['my-routines'] }); 
        }
    }) 
    
    const handleCreateNewRoutine = (formData: RoutineCreateForm) => {
        mutate(formData);
    };

    const handleAddExerciseOption = () => {
        if(addExercise){
            setShowAddExerciseForm(true);
        }
    }
    
    const closeCreateRoutineForm = useRoutineFormStore((state) => state.closeCreateRoutineForm)
    const setRoutineId = useRoutineFormStore((state) => state.setRoutineId)
    const setShowAddExerciseForm = useRoutineFormStore((state) => state.setShowAddExerciseForm)

    return(
        <>
            <div className="fixed inset-0 bg-black opacity-90 items-center justify-center flex h-screen">
                <form
                    onSubmit={handleSubmit(handleCreateNewRoutine)}
                    className="bg-white p-6 flex shadow-md rounded-md flex-col space-y-4 w-100"
                    noValidate
                >
                    <h2 className="text-3xl">Create new routine</h2>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Name</label>
                        <input
                            id="name"
                            type="text"
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
                                    message: "Routine name must be at most 50 characters long"
                                }
                            })}
                        />
                        {errors.name && (
                            <span className="text-red-500">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Description</label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Hard as a rock, easy as a pie"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("description", {
                                maxLength: {
                                    value: 40,
                                    message: "Description must be at most 40 characters long"
                                }}
                            )}
                        />
                        {errors.description && (
                            <span className="text-red-500">{errors.description.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Category</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {routineCategoryArray.map((value) => {
                            const label = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                            return (
                                <div key={value} className="flex items-center">
                                <input
                                    type="radio"
                                    id={value}
                                    value={value}
                                    className="form-radio h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 cursor-pointer"
                                    {...register('category', 
                                        { required: 'Please select a category' }
                                    )}
                                    defaultChecked={value === 'FREE'} // Marca "FREE" por defecto (opcional)
                                />
                                <label htmlFor={value} className="ml-2 text-gray-700 cursor-pointer">
                                    {label}
                                </label>
                                </div>
                            );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Add exercises</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="yes"
                                    checked={addExercise}
                                    onChange={() => setAddExercise(true)}
                                    className="form-radio text-blue-600 cursor-pointer"
                                />
                                <span>Yes</span>
                            </label>
                        </div>

                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="no"
                                    checked={!addExercise}
                                    onChange={() => setAddExercise(false)}
                                    className="form-radio text-blue-600 cursor-pointer"
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            type="submit"
                            value="Create Routine"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            onClick={closeCreateRoutineForm}
                            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>


                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    />
            </div>
        </>
    )
}
