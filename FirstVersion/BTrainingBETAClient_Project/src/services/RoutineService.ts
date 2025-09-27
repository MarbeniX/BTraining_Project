import api from '@/lib/axios';
import { exerciseReceiveListSchema, type Exercise, type ExerciseDifficulty, type ExerciseMuscle } from '@/types/exerciseTypes';
import { getRoutineByIdResponseSchema, GetRoutoinesResponseSchema, type Routine, type RoutineCreateForm, type RoutineUpdateForm } from '@/types/routineTypes';
import { isAxiosError } from 'axios';

export async function createRoutine(formData: RoutineCreateForm){
    try{
        const url = '/routine/create-routine';
        const { data } = await api.post(url, formData)
        console.log(data);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getAllRoutines(){
    try{
        const url = '/routine/getRoutines';
        const { data } = await api.get(url);
        const response = GetRoutoinesResponseSchema.safeParse(data);
        if(response.success == true){
            return response.data;
        }else{
            throw new Error('Invalid response format');
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateRoutine({id, formData}: {id: Routine['id'], formData: RoutineUpdateForm}){
    try{
        const url = `/routine/${id}`;
        const { data } = await api.put(url, formData);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getRoutineById(id: Routine['id']){
    try{
        const url = `/routine/${id}`;
        const { data } = await api.get(url);
        const response = getRoutineByIdResponseSchema.safeParse(data);
        if(response.success){
            return response.data;
        }
    }catch(error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteRoutineById(id: Routine['id']){
    try{
        const url = `/routine/${id}`;
        const { data } = await api.delete(url);
        return data;
    }catch(error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function searchExercises(params?: {title?: string, muscle?: ExerciseMuscle, difficulty?: ExerciseDifficulty}){
    try{
        const url = '/routine/search'
        const { data } = await api.get(url, { params });
        const response = exerciseReceiveListSchema.safeParse(data);
        if(response.success){
            return response.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function addExerciseToRoutine({idRoutine, idExercise}: {idRoutine: Routine['id'], idExercise: Exercise['id']}){
    try{
        const url = `/routine/${idRoutine}/${idExercise}`
        const { data } = await api.post(url);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function removeExerciseFromRoutine({idRoutine, idExercise}: {idRoutine: Routine['id'], idExercise: Exercise['id']}){
    try{
        const url = `/routine/${idRoutine}/${idExercise}`
        const { data } = await api.delete(url);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

