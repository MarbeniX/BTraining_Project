import { useNavigate } from 'react-router-dom';
import { useRoutineFormStore } from '@/stores/routineStore';
import { IoMdClose } from "react-icons/io";

type readyToSweatCompProps = {
    title: string
    message: string
    isTraining?: boolean
}

export default function readyToSweatComp({title, message, isTraining}: readyToSweatCompProps) {
    const navigate = useNavigate();
    const handleRoutineClick = () => {
        navigate('/train');
        setShowSearchRoutinesBar(true);
        setModeHowDoYouWantToTrain(true);
    }

    const handleFreeClick = () => {
        navigate('/train');
        setShowSearchRoutinesBar(true);
        setModeHowDoYouWantToTrain(false);
    }

    const buttons = [
        { label: 'Routine', onclick: handleRoutineClick},
        { label: 'Free', onclick: handleFreeClick},
    ]

    const setShowSearchRoutinesBar = useRoutineFormStore((state) => state.setShowSearchRoutinesBar)
    const setModeHowDoYouWantToTrain = useRoutineFormStore((state) => state.setModeHowDoYouWantToTrain)
    return (
        <>
            <div className="bg-gray-600 rounded-2xl flex flex-col p-5 items-center text-black shadow-md w-full max-w-2xl mx-auto space-y-4">
                <div className='flex items-center justify-center w-full relative'>
                    <h2 className="text-2xl md:text-3xl text-center">{title}</h2>
                    {isTraining && (
                        <IoMdClose 
                            onClick={() => navigate('/')}
                            className='text-2xl cursor-pointer right-0 absolute'
                        />
                    )}
                </div>
                <p className="text-center text-sm md:text-base">{message}</p>

                <div className="flex flex-col sm:flex-row sm:space-x-4 w-full justify-center space-y-4 sm:space-y-0">
                    {buttons.map((button) => (
                    <button
                        key={button.label}
                        onClick={button.onclick}
                        className="bg-gray-400 rounded p-4 hover:bg-gray-500 transition-colors w-full sm:w-1/4 cursor-pointer"
                    >
                        {button.label}
                    </button>
                    ))}
                </div>
            </div>
        </>
    )
}
