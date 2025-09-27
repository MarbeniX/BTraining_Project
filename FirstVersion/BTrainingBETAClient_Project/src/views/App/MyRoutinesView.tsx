import { getAllRoutines } from "@/services/RoutineService"
import { useQuery } from "@tanstack/react-query"
import RoutineComp from "@/components/app/routineComp";
import { useState, useEffect } from "react";
import {CreateNewRoutineForm} from "@/components/forms/CreateNewRoutineForm";
import { type RoutineCategory, type Routine, routineCategoryArray } from "@/types/routineTypes";
import { searchRoutines } from "@/services/TrainingService";
import { useRoutineFormStore } from "@/stores/routineStore";

export default function MyRoutinesView() {
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [category, setCategory] = useState<RoutineCategory | undefined>(undefined)

    const { data: searchResults, refetch: searchRefetch} = useQuery({
        queryKey: ['search-routines', debouncedQuery, category],
        queryFn: () => searchRoutines({ name: debouncedQuery, category}),
        enabled: false,
    })
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 100)
        return () => {
            clearTimeout(timeout)
        }
    }, [query])

    useEffect(() => {
        if(debouncedQuery.length > 0 || category) {
            searchRefetch();
        }
    }, [debouncedQuery, category ,searchRefetch])

    const { data, error } = useQuery({
        queryFn: getAllRoutines,
        queryKey: ['my-routines']
    }) 

    const handleDeleteRoutine = (formData : Routine['id']) => {
        setRoutineId(formData)
        setShowDeleteRoutineConfirmationForm(true);
    }

    const routines = data?.data || [];
    const routinesPerPage = 8
    const totalPages = Math.ceil(routines.length / routinesPerPage);
    const startIndex = (currentPage - 1) * routinesPerPage;
    const endIndex = startIndex + routinesPerPage;
    const routinesToDisplay = routines.slice(startIndex, endIndex);

    const showCreateRoutineForm = useRoutineFormStore((state) => state.showCreateRoutineForm)
    const openCreateRoutineForm = useRoutineFormStore((state) => state.openCreateRoutineForm)
    const setShowDeleteRoutineConfirmationForm = useRoutineFormStore((state) => state.setShowDeleteRoutineConfrmationForm)
    const setRoutineId = useRoutineFormStore((state) => state.setRoutineId)
    const setShowViewRoutineDetails = useRoutineFormStore((state) => state.setShowViewRoutineDetails)

    if(error){
        return (
            <div className="text-red-500">
                <h2 className="text-2xl">Error loading data</h2>
            </div>
        );
    }

    if(data)return (
        <>
            <div className="flex flex-col p-4 space-y-8 w-max h-full relative">
                <h1 className="text-3xl">My routines</h1>

                <div className="flex space-x-5 items-center">
                    <div className="w-full flex justify-center">
                        <input
                            type="text"
                            placeholder="What do you want to train today?"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        
                        <select
                            value={category ?? ''}
                            onChange={(e) =>  setCategory(e.target.value as RoutineCategory)}
                            className="p-3 border border-gray-300 rounded-lg"
                        >
                            <option value="">Category</option>
                            {routineCategoryArray.map((cat) => (
                                <option
                                    key={cat}
                                    value={cat}
                                >{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="w-1/2 bg-gray-400 hover:bg-gray-500 cursor-pointer rounded-md p-3 flex items-center"
                        onClick={openCreateRoutineForm}
                    >
                        <div className="rounded-full p-2 bg-amber-500 mr-3"/>
                        Create new routine
                    </button>
                </div>

                {routines.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4 h-full">
                        {routinesToDisplay.map((routine) => (
                            <RoutineComp 
                                key={routine.id} 
                                data={routine} 
                                onDelete={() => handleDeleteRoutine(routine.id)}
                                onViewRoutine={() => {
                                    setRoutineId(routine.id);
                                    setShowViewRoutineDetails(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Still no routines, create one</p>
                )}
                
                {searchResults && searchResults.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-30 ml-4 bg-white border border-gray-300 shadow-lg rounded-lg overflow-y-auto">
                        {searchResults.map((routine) => (
                            <li
                                key={routine.id}
                                className="cursor-pointer hover:bg-gray-100 rounded-md p-2"
                                onClick={() => {
                                    setRoutineId(routine.id);
                                    setShowViewRoutineDetails(true);
                                }}
                            >
                                <p>{routine.name}</p>
                            </li>
                        ))}
                    </ul>
                )}
                
                <div className="flex justify-center w-full space-x-2 mt-auto">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 rounded-md border ${
                                currentPage === index + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-black hover:bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {showCreateRoutineForm && (
                    <CreateNewRoutineForm/>
                )}
            </div>
        </>
    )
}
