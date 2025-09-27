import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { exerciseDifficultyArray, exerciseMuscleArray, type Exercise, type ExerciseDifficulty, type ExerciseMuscle } from '@/types/exerciseTypes';
import { addExerciseToRoutine, searchExercises } from '@/services/RoutineService';
import ExerciseComp from "@/components/app/exerciseComp"
import { useRoutineFormStore } from '@/stores/routineStore';
import { createPortal } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';

type SearchExercisesBarFormProps = {
    isOpen: boolean,
}

export default function SearchExercisesBarForm({ isOpen }: SearchExercisesBarFormProps) {
    if (!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null;
    if (!container) return null;

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [muscle, setMuscle] = useState<ExerciseMuscle | undefined>();
    const [difficulty, setDifficulty] = useState<ExerciseDifficulty | undefined>();

    const { data: searchResult, refetch: searchRefetch } = useQuery({
        queryKey: ['search-exercises', debouncedQuery, muscle, difficulty],
        queryFn: () => searchExercises({ title: debouncedQuery, muscle, difficulty }),
        enabled: false,
    })

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 100)
        return() => {
            clearTimeout(timeout)
        }
    },[query])

    useEffect(() => {
        if(debouncedQuery.length > 0 || muscle || difficulty) {
            searchRefetch();
        }
    }, [debouncedQuery, muscle, difficulty, searchRefetch])
    
    const queryClient = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: addExerciseToRoutine,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['my-routines'] });
            queryClient.invalidateQueries({ queryKey: ['routines'] });
            queryClient.invalidateQueries({ queryKey: ['routine', routineId]});
        }
    })

    const setShowAddexerciseForm = useRoutineFormStore((state) => state.setShowAddExerciseForm)
    const routineId = useRoutineFormStore((state) => state.routineId)

    const handleAddExercise = (idExercise: Exercise['id']) => {
        mutate({ idRoutine: routineId, idExercise });
    }

    return createPortal(
        <Fragment>
            <div className="fixed inset-0 z-50 bg-black/50 items-center justify-center flex h-screen">
                <div className="bg-white p-6 shadow-md rounded-md w-1/2 flex flex-col space-y-2">
                    <label className="text-2xl">Search exercises</label>
                    <div className='flex justify-center'>
                        <input
                            type="text"
                            placeholder="Add exercises to your routine"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />

                        <select
                            value={muscle ?? ''}
                            onChange={(e) => setMuscle(e.target.value as ExerciseMuscle)}
                            className='p-3 border border-gray-300 rounded-lg'
                        >
                            <option value=''>Muscle</option>
                            {exerciseMuscleArray.map((muscle) => (
                                <option
                                    key={muscle}
                                    value={muscle}
                                >{muscle.charAt(0) + muscle.slice(1).toLowerCase()}</option>
                            ))}
                        </select>

                        <select
                            value={difficulty ?? ''}
                            onChange={(e) => setDifficulty(e.target.value as ExerciseDifficulty)}
                            className='p-3 border border-gray-300 rounded-lg'
                        >
                            <option value=''>Difficulty</option>
                            {exerciseDifficultyArray.map((difficulty) => (
                                <option
                                    key={difficulty}
                                    value={difficulty}
                                >{difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                        
                        {searchResult && searchResult.length > 0 && (
                            <ul className='mt-13 absolute w-1/2 bg-white border border-gray-300 shadow-lg rounded-lg overflow-y-auto'>
                                {searchResult.map((exercise) => (
                                    <li
                                        key={exercise.id}
                                        className='cursor-pointer hover:bg-gray-100 rounded-md p-2'
                                    >
                                        <ExerciseComp 
                                            data={exercise}
                                            onClick={() => handleAddExercise(exercise.id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button 
                        className="w-full bg-gray-400 hover:bg-gray-500 cursor-pointer rounded-md p-3 flex items-center justify-center"
                        onClick={() => setShowAddexerciseForm(false)}
                    >
                        Save
                    </button>
                </div>
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
        </Fragment>,
        container
    )
}
