import SearchBarRoutinesComp from "@/components/forms/SearchBarRoutinesComp"
import { useRoutineFormStore } from "@/stores/routineStore"
import HowDoYouWanToTrainPopUp from "@/components/pop-ups/HowDoYouWantToTrainPopUp"
import { FaDumbbell, FaFlag } from "react-icons/fa";
import { MdOutlineSportsGymnastics, MdSaveAlt } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";
import { VscDebugContinue } from "react-icons/vsc";
import { IoPause } from "react-icons/io5";
import { useState, useRef } from "react";
import type { ActualExerciseTraining, Exercise } from "@/types/exerciseTypes";
import { useQuery } from "@tanstack/react-query";
import { getRoutineById } from "@/services/RoutineService";
import RoutineExercisesPopUp from "@/components/pop-ups/RoutineExercisesPopUp";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationMessage1 from "@/components/messages/confirmation_message"
import ConfirmationMessage3 from "@/components/messages/confirmation_message3"
import { type TrainingSession, type TrainingSessionExerciseComp } from "@/types/trainingSessionTypes";
import TrainingSessionExercise from "@/components/app/trainingSessionExerciseComp"
import { useMutation } from "@tanstack/react-query";
import { endTrainingSession, startTrainingSession } from "@/services/TrainingService";
import formatTime from "@/utils/formatTime";

export default function TrainView() {
    const [time, setTime] = useState(0); // tiempo en milisegundos
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [isPaused, setIsPaused] = useState(false);    
    const [exercise, setExercise] = useState<Exercise>();
    const [actualExerciseTraining, setActualExerciseTraining] = useState<ActualExerciseTraining>()
    
    const [showRoutineExercises, setShowRoutineExercises] = useState(false);
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    const [marks, setMarks] = useState<TrainingSessionExerciseComp[]>([]);
    const [isEditingMark, setIsEditingMark] = useState(false)

    const workoutActions = {
        running: [
            {
                label: 'Change exercise',
                icon: <FaDumbbell />,
                onClick: () => {
                    if (routineNameAndIdTraining) {
                        searchRoutioneRefetch().then(() => {
                            setShowRoutineExercises(true);
                        });
                    }else{
                        toast.error("Please select a routine to change exercise.");
                    }
                }
            },
            {
                label: 'Start',
                icon: <MdOutlineSportsGymnastics />,
                onClick: () => {
                    onStart()
                }
            },
            {
                label: 'Set mark',
                icon: <FaFlag />,
                onClick: () => {
                    if(!actualExerciseTraining){
                        toast.error("Please select an exercise to set a mark.");
                    }else{
                        if(!isEditingMark){
                            const newMark: TrainingSessionExerciseComp = {
                                exerciseId: actualExerciseTraining.id,
                                timeToComplete: time,
                                setNumber: 0,
                                reps: 0,
                                title: actualExerciseTraining.title,
                                trainingSessionId: "", // Set this to the correct session ID if available
                            }
                            setMarks((prevMarks) => [...prevMarks, newMark]);
                            setIsEditingMark(true);
                        }else{
                            toast.error("Please finish editing the current mark before setting a new one.");
                        }
                    }
                }
            },
        ],
        stopped: [
            {
                label: 'Reset',
                icon: <RiResetLeftFill />,
                onClick: () => {
                    setShowResetConfirmation(true);
                }
            },
            {
                label: 'Continue',
                icon: <VscDebugContinue />,
                onClick: () => {
                    onStart()
                    setIsPaused(false)
                }
            },
            {
                label: 'Save',
                icon: <MdSaveAlt />,
                onClick: () => {
                    if(marks.length === 0){
                        toast.error("You need to set at least one mark before saving your workout.");
                    }else{
                        setShowSaveConfirmation(true);
                    }
                }
            },
        ],
        pause: [
            {
                label: 'Pause',
                icon: <IoPause />,
                onClick: () => {
                    onPause()
                }   
            }
        ]
    }

    const tableLabels = [
        {
            label: 'Number',
        },
        {
            label: 'Time',
        },
        {
            label: 'Exercise trained',
        },
        {
            label: 'Set',
        },
        {
            label: 'Reps',
        },
        {
            label: 'Actions',
        }
    ]

    const handleContinueTraining = () => {
        setShowSearchRoutines(false)
        setHowDoYouWantToTrain(false)
    }
    const handleCloseTraining = () => {
        setHowDoYouWantToTrain(true)
        setShowSearchRoutines(false)
    }
    
    const onStart = () => {
        if (!isRunning) {
        setIsRunning(true);
        timerRef.current = setInterval(() => {
            setTime((prevTime) => prevTime + 10); // cada 10ms
        }, 10);
        }
    };

    const onPause = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setIsRunning(false);
        setIsPaused(true);
    };

    const onReset = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setMarks([]);
        setIsRunning(false);
        setTime(0);
    };

    const showSearchBarRoutines = useRoutineFormStore((state) => state.showSearchRoutinesBar)
    const showHowDoYouWantToTrain = useRoutineFormStore((state) => state.showHowDoYouWantToTrainPopUp)
    const modeHowDoYouWantToTrain = useRoutineFormStore((state) => state.modeHowDoYouWantToTrain)
    const routineNameAndIdTraining = useRoutineFormStore((state) => state.routineNameAndIdTraining)
    const setShowSearchRoutines = useRoutineFormStore((state) => state.setShowSearchRoutinesBar)
    const setHowDoYouWantToTrain = useRoutineFormStore((state) => state.setShowHowDoYouWantToTrain)

    const { data: searchRoutineData, refetch: searchRoutioneRefetch } = useQuery({
        queryKey: ['search-routine-train', routineNameAndIdTraining?.id],
        queryFn: () => getRoutineById(routineNameAndIdTraining?.id!),
        enabled: false
    })

    const { mutateAsync: mutateStartTrainingSession } = useMutation({
        mutationFn: startTrainingSession
    })
    const handleStartTrainingSession = async () =>{
        const data = await mutateStartTrainingSession(routineNameAndIdTraining.id)
        console.log(routineNameAndIdTraining.id)
        if(data){
            const sessionId = data.data
            handleEndTrainingSession(sessionId)
            onReset()
            setActualExerciseTraining(undefined)
            setIsPaused(false)
            toast.success(data.message)
        }else{
            toast.error("Failed to start training session.")
        }
    }

    const { mutate: mutateEndTrainingSession } = useMutation({
        mutationFn: endTrainingSession, 
        onSuccess: (data) => {
            toast.success(data.message)
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    }) 
    const handleEndTrainingSession = (sessionId: TrainingSession['id']) => {
        if(sessionId && marks.length > 0){
            const marksToSend = marks.map(mark => ({
                exerciseId: mark.exerciseId,
                timeToComplete: mark.timeToComplete,
                setNumber: mark.setNumber,
                reps: mark.reps,
                trainingSessionId: sessionId
            }))
            mutateEndTrainingSession({ id: sessionId, marks: marksToSend })
        }
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full bg-fuchsia-300">
                <h1 className="text-3xl">Let's go all out!</h1>
                <div className="p-4 bg-red-400 rounded-lg shadow-lg">
                    <div className="text-6xl font-mono">{formatTime(time)}</div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {(!isPaused) ? (
                        <>
                            <button
                                className="flex items-center justify-center bg-white text-black rounded-lg p-4 mt-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer w-48"
                                onClick={workoutActions.running[0].onClick}
                            >
                            <span className="text-xl mr-2">{workoutActions.running[0].icon}</span>
                                {workoutActions.running[0].label}
                            </button>     

                            {!isRunning ? (
                                <button
                                    className="flex items-center justify-center bg-white text-black rounded-lg p-4 mt-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer w-48"
                                    onClick={workoutActions.running[1].onClick}
                                >
                                <span className="text-xl mr-2">{workoutActions.running[1].icon}</span>
                                    {workoutActions.running[1].label}
                                </button>                 
                            ) : (
                                <button
                                    className="flex items-center justify-center bg-white text-black rounded-lg p-4 mt-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer w-48"
                                    onClick={workoutActions.pause[0].onClick}
                                >
                                <span className="text-xl mr-2">{workoutActions.pause[0].icon}</span>
                                    {workoutActions.pause[0].label}
                                </button>                 
                            )}

                            <button
                                className="flex items-center justify-center bg-white text-black rounded-lg p-4 mt-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer w-48"
                                onClick={workoutActions.running[2].onClick}
                            >
                            <span className="text-xl mr-2">{workoutActions.running[2].icon}</span>
                                {workoutActions.running[2].label}
                            </button>     
                        </>
                    ) : (
                        <>
                            {workoutActions.stopped.map((action) => (
                                <button
                                    key={action.label}
                                    className="flex items-center justify-center bg-white text-black rounded-lg p-4 mt-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer w-48"
                                    onClick={action.onClick}
                                >
                                <span className="text-xl mr-2">{action.icon}</span>
                                    {action.label}
                                </button>     
                            ))}
                        </>
                    )}
                </div>
        
                {modeHowDoYouWantToTrain ? (
                    <div className="flex items-center justify-center flex-col gap-2">
                        <p className="text-2xl mt-2">Workout by Routine | {routineNameAndIdTraining.name}</p>
                        {actualExerciseTraining ? (
                            <p>Training {actualExerciseTraining.title}</p>
                        ) : (
                            <p>Select an exercise to set marks</p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-col gap-2">
                        <p className="text-2xl mt-2">Workout Free | {exercise?.title}</p>
                    </div>
                )}

                <div className="grid grid-cols-6 items-center justify-items-center w-full p-2 max-w-6xl ">
                    {tableLabels.map((label) => (
                        <div 
                            key={label.label} 
                            className="text-center rounded-lg"
                        >
                            {label.label}
                        </div>
                    ))}
                </div>


                <div className="flex flex-col w-full max-w-6xl">
                    {marks.length > 0 ? (
                        marks.map((mark, idx) => (
                            <TrainingSessionExercise
                                key={idx}
                                exercise={mark}
                                index={idx + 1}
                                isEditingMark={isEditingMark}
                                onDelete={() => {
                                    setMarks((prevMarks) => prevMarks.filter((_, index) => index !== idx));
                                    setIsEditingMark(false);
                                }}
                                onEdit={(newSet, newReps) => {
                                    setMarks((prevMarks) =>
                                    prevMarks.map((m, i) =>
                                        i === idx ? { ...m, setNumber: newSet, reps: newReps } : m
                                    ));
                                    setIsEditingMark(false);
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-4">
                            No marks recorded yet.
                        </div>
                    )}
                </div>
            </div>

            {showHowDoYouWantToTrain && routineNameAndIdTraining.id === '' && (
                <HowDoYouWanToTrainPopUp isOpen={showHowDoYouWantToTrain} />
            )}

            {showSearchBarRoutines && (
                <SearchBarRoutinesComp
                    isOpen={showSearchBarRoutines}
                    onContinue={handleContinueTraining}
                    onClose={handleCloseTraining}
                    setExerciseID={setExercise}
                />
            )}

            {showRoutineExercises && (
                <RoutineExercisesPopUp
                    isOpen={showRoutineExercises}
                    routine={searchRoutineData?.data!}
                    onClose={() => setShowRoutineExercises(false)}
                    setActualExerciseTraining={setActualExerciseTraining}
                />
            )}

            {showResetConfirmation && (
                <ConfirmationMessage1
                    isOpen={showResetConfirmation}
                    title='Are you sure you want to rest your workout?'
                    message="This timer will start from 0, and all the current marks will be lost."
                    onCancel={() => setShowResetConfirmation(false)}
                    onConfirm={() => {
                        onReset()
                        setShowResetConfirmation(false)
                        setActualExerciseTraining(undefined)
                        setIsPaused(false)
                    }}
                />
            )}

            {showSaveConfirmation && (
                <ConfirmationMessage3
                    isOpen={showSaveConfirmation}
                    title="Are you sure you want to save your workout?"
                    message="You can check the details of your workout in the 'My activity' section."
                    onBack={() => setShowSaveConfirmation(false)}
                    onSave={async() => {
                        setShowSaveConfirmation(false)
                        await handleStartTrainingSession()
                    }}
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
