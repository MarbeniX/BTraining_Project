import { addExercise } from "@/services/ExerciseService";
import { exerciseDifficultyArray, exerciseMuscleArray, type ExerciseForm } from "@/types/exerciseTypes";
import { useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { RiCloseLargeFill } from "react-icons/ri";
import { useQueryClient } from "@tanstack/react-query";

type CreateNewExerciseFormProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CreateNewExerciseForm({isOpen, onConfirm, onCancel}: CreateNewExerciseFormProps) {
    if(!isOpen) return null;

    const container = typeof window !== 'undefined' ? document.body : null;
    if(!container) return null;

    const { register, handleSubmit, formState: {errors}} = useForm<ExerciseForm>()

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: addExercise,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({queryKey: ['exercises']})
            onConfirm();
        }
    })

    const handleCreateExercise = (formData: ExerciseForm) => {
        const data = new FormData()
        data.append('title', formData.title);
        data.append('description', formData.description || '');
        data.append('muscle', formData.muscle);
        data.append('difficulty', formData.difficulty);
        if(formData.image && formData.image.length > 0){
            data.append('image', formData.image[0]);
        }
        mutate(data)
    }

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <form
                    className="bg-white p-6 flex shadow-md rounded-md flex-col space-y-2 w-[40%]"
                    onSubmit={handleSubmit(handleCreateExercise)}
                    noValidate
                    encType="multipart/form-data"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl">Create new exercise</h2>
                        <RiCloseLargeFill
                            className="cursor-pointer text-xl text-gray-500 hover:text-gray-700 transition-all"
                            onClick={onCancel}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Exercise name</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter the exercise name"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("title", {
                                required: "Exercise name is required",
                                minLength: {
                                    value: 5, 
                                    message: "Exercise name must be at leat 5 characters long"
                                },
                                maxLength:{
                                    value: 15, 
                                    message: "Exercise name must be at most 15 characters long"
                                }
                            })}
                        />
                        {errors.title && (
                            <span className="text-red-500">{errors.title.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Description</label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Enter description"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("description", {
                                required: "There most be a description"
                            })}
                        />
                        {errors.description && (
                            <span className="text-red-500">{errors.description.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Muscle</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {exerciseMuscleArray.map((muscle) => {
                                const label = muscle.charAt(0).toUpperCase() + muscle.slice(1).toLowerCase();
                                return (
                                    <div 
                                        key={muscle}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="radio"
                                            id={muscle}
                                            value={muscle}
                                            className="form-radio h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 cursor-pointer"
                                            {...register('muscle', {
                                                required: 'Please select a muscle'
                                            })}
                                            />
                                        <label 
                                            htmlFor={muscle}
                                            className="ml-2 text-gray-700 cursor-pointer"
                                            >{label}</label>
                                    </div>
                                )
                            })}
                        </div>
                        {errors.muscle && (
                            <span className="text-red-500">{errors.muscle.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Difficulty</label>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            {exerciseDifficultyArray.map((difficulty) => {
                                const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
                                return(
                                    <div
                                        key={difficulty}
                                        className="flex items-center"
                                    >
                                        <input
                                            id={difficulty}
                                            type="radio"
                                            value={difficulty}
                                            className="form-radio h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 cursor-pointer"
                                            {...register('difficulty', {
                                                required: 'Please select a difficulty'
                                            })}
                                        />
                                        <label 
                                            htmlFor={difficulty}
                                            className="ml-2 text-gray-700 cursor-pointer"
                                            >{label}</label>
                                    </div>
                                )
                            })}
                        </div>
                            {errors.difficulty && (
                                <span className="text-red-500">{errors.difficulty.message}</span>
                            )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl">Upload picture</label>
                        <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("image", {
                            required: "Please upload a picture",
                            validate: {
                            lessThan50MB: (files: FileList | undefined) =>
                                !files || files[0]?.size < 50_000_000 || "File size must be less than 50MB",
                            acceptedFormats: (files: FileList | undefined) =>
                                !files || files[0]?.type.startsWith("image/") || "Only image files are allowed",
                            },
                        })}
                        />
                        {errors.image && (
                            <span className="text-red-500">{errors.image.message}</span>
                        )}
                        <label 
                            htmlFor="image"
                            className="cursor-pointer w-full p-2 border border-gray-300 rounded-lg bg-white text-center hover:bg-gray-100 transition"
                        >Click here to upload an image</label>
                    </div>

                    <div>
                        <input
                            type="submit"
                            value="Create exercise"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors w-full"
                        />
                    </div>
                </form>

            </div>

            <ToastContainer/>
        </>,
        container
    )
}
