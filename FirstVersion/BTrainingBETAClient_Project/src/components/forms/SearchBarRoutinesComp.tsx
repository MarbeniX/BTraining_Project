import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { routineCategoryArray, type RoutineCategory } from "@/types/routineTypes";
import { searchRoutines } from "@/services/TrainingService";
import { IoMdClose } from "react-icons/io";
import { exerciseDifficultyArray, exerciseMuscleArray, type Exercise, type ExerciseDifficulty, type ExerciseMuscle } from "@/types/exerciseTypes";
import { searchExercises } from "@/services/RoutineService";
import ExerciseComp from "@/components/app/exerciseComp"
import { useRoutineFormStore } from "@/stores/routineStore";

type SearchBarRoutinesCompProps = {
    isOpen: boolean;
    onContinue: () => void;
    onClose: () => void;
    setExerciseID: (exercise: Exercise) => void;
}

export default function SearchBarRoutinesComp({ isOpen, onContinue, onClose, setExerciseID } : SearchBarRoutinesCompProps) {
    if(!isOpen) return null;
    const container = typeof window !== 'undefined' ? document.body : null;
    if(!container) return null;

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [category, setCategory] = useState<RoutineCategory | undefined>(undefined);
    const [routineName, setRoutineName] = useState('');
    const [exerciseName, setExerciseName] = useState('');
    const [muscle, setMuscle] = useState<ExerciseMuscle | undefined>();
    const [difficulty, setDifficulty] = useState<ExerciseDifficulty | undefined>();

    const { data: searchRoutinesData, refetch: searchRoutinesRefetch } = useQuery({
        queryKey: ['search-routines-train', debouncedQuery, category],
        queryFn: () => searchRoutines({name: debouncedQuery, category}),
        enabled: false,
    })

    const { data: searchExercisesData, refetch: searchExercisesRefetch } = useQuery({
        queryKey: ['search-exercises-train', debouncedQuery, muscle, difficulty],
        queryFn: () => searchExercises({title: debouncedQuery, muscle, difficulty}),
        enabled: false
    })

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        timeout = setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 100)
        return () => {
            clearTimeout(timeout)
        }
    }, [query])

    useEffect(() => {
        if(debouncedQuery.length > 0 || category || muscle || difficulty) {
            if(modeHouDoYouWantToTrain) {
                searchRoutinesRefetch();
            }else{
                searchExercisesRefetch();
            }
        }
    }, [debouncedQuery, category, muscle, difficulty])

    const handleTrain = () => {
        if(routineName !== '' || exerciseName !== '') {
            onContinue();
        }
    }

    const modeHouDoYouWantToTrain = useRoutineFormStore((state) => state.modeHowDoYouWantToTrain)
    const setRoutineNameAndIdTraining = useRoutineFormStore((state) => state.setRoutineNameAndIdTraining)

    return createPortal (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-[50%] space-y-2">
                    <div className="flex items-center justify-between">
                        {modeHouDoYouWantToTrain === true ? (
                            <label className="text-3xl">Search Routines</label>
                        ) : (
                            <label className="text-3xl">Search Exercises</label>
                        )}
                        <IoMdClose 
                            className="text-2xl cursor-pointer"
                            onClick={onClose}
                        />
                    </div>

                    <div className="flex justify-center">
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {modeHouDoYouWantToTrain === true ? (
                            <select
                                value={category ?? ''}
                                onChange={(e) => setCategory(e.target.value as RoutineCategory)}
                                className="border border-gray-300 rounded-md p-2 w-1/3"
                                style={{ textAlign: 'center' }}
                            >
                                <option value="">Category</option>
                                {routineCategoryArray.map((cat) => (
                                    <option
                                        key={cat}
                                        value={cat}
                                    >{cat}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex w-2/3">
                                <select
                                    value={muscle ?? ''}
                                    onChange={(e) => setMuscle(e.target.value as ExerciseMuscle)}
                                    className="border border-gray-300 rounded-md p-2 w-1/2"
                                    style={{ textAlign: 'center' }}
                                >
                                    <option value=''>Muscle</option>
                                    {exerciseMuscleArray.map((muscle) => (
                                        <option
                                            key={muscle}
                                            value={muscle}
                                        >{muscle.charAt(0) + muscle.slice(1).toLocaleLowerCase()}</option>
                                    ))}
                                </select>

                                <select
                                    value={difficulty ?? ''}
                                    onChange={(e) => setDifficulty(e.target.value as ExerciseDifficulty)}
                                    className="border border-gray-300 rounded-md p-2 w-1/2"
                                    style={{ textAlign: 'center' }}
                                >
                                    <option value=''>Difficulty</option>
                                    {exerciseDifficultyArray.map((difficulty) => (
                                        <option
                                            key={difficulty}
                                            value={difficulty}
                                        >{difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {searchRoutinesData && searchRoutinesData.length > 0 && modeHouDoYouWantToTrain && (
                            <ul className="mt-10 absolute w-1/2 bg-white border border-gray-300 shadow-lg rounded-lg overflow-y-auto">
                                {searchRoutinesData.map((routine) => (
                                    <li
                                        key={routine.id}
                                        className="cursor-pointer hover:bg-gray-100 rounded-md p-2"
                                        onClick={() => {
                                            setRoutineName(routine.name);
                                            setRoutineNameAndIdTraining(routine.id, routine.name);
                                            console.log('Routine selected:', routine.name, routine.id);
                                        }}
                                    >
                                        {routine.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {searchExercisesData && searchExercisesData.length > 0 && !modeHouDoYouWantToTrain && (
                            <ul className="mt-13 absolute w-1/2 bg-white border border-gray-300 shadow-lg overflow-y-auto">
                                {searchExercisesData.map((exercise) => (
                                    <li
                                        key={exercise.id}
                                        className="cursor-pointer hover:bg-gray-100 rounded-md p-2"
                                    >
                                        <ExerciseComp
                                            data={exercise}
                                            onClick={() => {
                                                setExerciseName(exercise.title)
                                                setExerciseID(exercise);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <h3 className="rounded-md text-center bg-green-300 text-2xl p-2 w-1/2">
                            {modeHouDoYouWantToTrain ? 'Routine: ' + routineName : 'Exercise: ' + exerciseName}
                        </h3>
                        <button
                            type="button"
                            className= "w-1/2 cursor-pointer bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition-colors text-2xl"
                            onClick={handleTrain}
                        >Train</button>
                    </div>
                </div>
            </div>
        </>,
        container
    )
}
