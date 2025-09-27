import { exerciseDifficultyArray, exerciseMuscleArray, type ExerciseForm } from "@/types/exerciseTypes";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { getExerciseById, updateExerciseById } from "@/services/ExerciseService";
import { toast, ToastContainer } from "react-toastify";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { RiCloseLargeFill } from "react-icons/ri";
import { useState } from "react";
import ConfirmMessage2 from "@/components/messages/confirmation_message2"

type ViewExerciseDetailsPopUpProps = {
    isOpen: boolean;
    onClose: () => void;
    exerciseId: string
}

export default function ViewExerciseDetailsPopUp({isOpen, onClose, exerciseId}: ViewExerciseDetailsPopUpProps) {
    if (!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null
    if (!container) return null;
    
    const [showUpdateExerciseConfirmForm, setShowUpdateExerciseConfirmForm] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ExerciseForm>();

    const { data } = useQuery({
        queryKey: ['exercise', exerciseId],
        queryFn: () => getExerciseById(exerciseId),
    })

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateExerciseById, 
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['exercises'] });
            queryClient.invalidateQueries({ queryKey: ['exercise', exerciseId] });
            onClose();
        }
    })

    const handleUpdate = () => {
        setShowUpdateExerciseConfirmForm(true);
    }
    const handleUpdateExerciseById = (formData: ExerciseForm) => {
        const dataFormData = new FormData()
        dataFormData.append('title', formData.title);
        dataFormData.append('description', formData.description!);
        dataFormData.append('muscle', formData.muscle);
        dataFormData.append('difficulty', formData.difficulty);
        if (formData.image &&  formData.image.length > 0) {
            dataFormData.append('image', formData.image[0]);
        }
        mutate({ id: exerciseId, formData: dataFormData });
    }

    if(data)return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <form
                    onSubmit={handleSubmit(handleUpdate)}
                    className="bg-white rounded-2xl shadow-xl p-6 w-[70%] max-w-lg flex flex-col space-y-2"
                    noValidate
                    encType="multipart/form-data"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl">Edit exercise</h2>
                        <RiCloseLargeFill
                                className="cursor-pointer text-xl text-gray-500 hover:text-gray-700 transition-all"
                                onClick={onClose}
                            />
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="text-2xl">Title</label>
                        <input
                            id="title"
                            type="text"
                            defaultValue={data.title}
                            placeholder="Enter title"
                            className="w-1/2 p-2 border border-gray-300 rounded-md"
                            {...register('title', {
                                required: 'Title is required',
                                minLength: {
                                    value: 3,
                                    message: 'Title must be at least 3 characters long'
                                }
                            })}
                        />
                    </div>
                    {errors.title && (
                        <span className="text-red-500">{errors.title.message}</span>
                    )}

                    <div className="flex flex-col justify-between gap-2">
                        <label className="text-2xl">Description</label>
                        <textarea
                            id='description'
                            defaultValue={data.description}
                            placeholder="Enter description"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            {...register('description', {
                                required: 'Description is required',
                                maxLength: {
                                    value: 20,
                                    message: 'Description must be at most 20 characters long'
                                }
                            })}
                        ></textarea>
                    </div>
                    {errors.description && (
                        <span className="text-red-500">{errors.description.message}</span>
                    )}

                    <div className="flex justify-between">
                        <label className="text-2xl">Muscle</label>
                        <select
                            id="muscle"
                            defaultValue={data.muscle}
                            className="w-1/2 p-2 border border-gray-300 rounded-md"
                            {...register('muscle', {
                                required: 'Muscle is required'
                            })}
                        >
                            <option value="">{data.muscle}</option>
                            {exerciseMuscleArray.map((muscle) => (
                                <option
                                    key={muscle}
                                    value={muscle}
                                >{muscle}</option>
                            ))}
                        </select>
                    </div>
                    {errors.muscle && (
                        <span className="text-red-500">{errors.muscle.message}</span>
                    )}

                    <div className="flex justify-between">
                        <label className="text-2xl">Difficulty</label>
                        <select
                            id="difficulty"
                            defaultValue={data.difficulty}
                            className="w-1/2 p-2 border border-gray-300 rounded-md"
                            {...register('difficulty', {
                                required: 'Difficulty is required'
                            })}
                        >
                            <option value="">{data.difficulty}</option>
                            {exerciseDifficultyArray.map((difficulty) => (
                                <option
                                    key={difficulty}
                                    value={difficulty}
                                >{difficulty}</option>
                            ))}
                        </select>
                    </div>
                    {errors.difficulty && (
                        <span className="text-red-500">{errors.difficulty.message}</span>
                    )}

                    <div className="flex flex-col">
                        <label className="text-2xl">Actual image</label>
                        <img
                            src={data.imageURL}
                            alt={data.title}
                            className="w-full h-auto rounded-md mb-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-2xl">Change image</label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("image", {
                                validate: {
                                lessThan50MB: (files: FileList | undefined) => {
                                    if (!files || files.length === 0) return true; // no image selected → OK
                                    return files[0].size < 50_000_000 || "File size must be less than 50MB";
                                },
                                acceptedFormats: (files: FileList | undefined) => {
                                    if (!files || files.length === 0) return true; // no image selected → OK
                                    return files[0].type.startsWith("image/") || "Only image files are allowed";
                                },
                                },
                            })}
                        />
                    </div>
                    <label
                        htmlFor="image"
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-md text-center"
                    >Click here to change the image</label>
                    {errors.image && (
                        <span className="text-red-500">{errors.image.message}</span>
                    )} 

                    <input
                        type="submit"
                        value="Update Exercise"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer mt-4"
                    />
                </form>
            </div>

            {showUpdateExerciseConfirmForm && (
                <ConfirmMessage2
                    isOpen={showUpdateExerciseConfirmForm}
                    title="Are you sure you want to save the changes?"
                    message="Once saved, the changes will be applied permanently"
                    onConfirm={handleSubmit(handleUpdateExerciseById)}
                    onCancel={() => setShowUpdateExerciseConfirmForm(false)}
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
        </>,
        container
    )
}
