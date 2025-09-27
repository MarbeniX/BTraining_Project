import api from '@/lib/axios';
import { routineSearchListRoutineSchema, type Routine, type RoutineCategory } from '@/types/routineTypes';
import { getAllTrainingSessionListResponseSchema, getTrainingSessionByIdSchema, type TrainingSession, type TrainingSessionExerciseList, type TrainingSessionSearchFilter } from '@/types/trainingSessionTypes';
import { isAxiosError } from 'axios';

export async function startTrainingSession(routineId: Routine['id']){
    try{
        const url = '/training/start'
        const payload = { routineId}
        const { data } = await api.post(url, payload)
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function endTrainingSession({ id, marks} : {id: TrainingSession['id'], marks: TrainingSessionExerciseList}){
    try{
        const url = `/training/${id}`
        const payload = { marks };
        const { data } = await api.put(url, payload);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getTrainingSessionById(id: TrainingSession['id']){
    try{
        const url = `/training/${id}`;
        const { data } = await api.get(url);
        const response = getTrainingSessionByIdSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getAllTrainingSession(){
    try{
        const url = '/training/trainingSessions'
        const { data } = await api.get(url);
        const response = getAllTrainingSessionListResponseSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteTrainingSessionById(id: TrainingSession['id']){
    try{
        const url = `/training/${id}`
        const  { data } = await api.delete(url);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function searchTrainingSessions(params?: {filter?: TrainingSessionSearchFilter}){
    try{
        const url = '/training/searchSessions'
        const { data } = await api.get(url, { params });
        const response = getAllTrainingSessionListResponseSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function searchRoutines(params?: {name?: string, category?: RoutineCategory}){
    try{
        const url = '/training/searchRoutines'
        const { data } = await api.get(url, { params });
        const reponse = routineSearchListRoutineSchema.safeParse(data);
        if (reponse.success) {
            return reponse.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function generateSessionPDF(id: TrainingSession['id']){
    try{
        const url = `/training/report/${id}`
        const response = await api.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);

        window.open(blobUrl, '_blank');
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}