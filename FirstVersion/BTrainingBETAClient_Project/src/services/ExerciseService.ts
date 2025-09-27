import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { exerciseReceiveListSchemaFullDTO, getExerciseByIdSchema, type Exercise } from '@/types/exerciseTypes';

export async function addExercise(formData: FormData){
    try{
        const url = '/exercise/add-exercise';
        const { data } = await api.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateExerciseById({id, formData}: {id: Exercise['id'], formData: FormData}){
    try{
        const url = `/exercise/${id}`
        const { data } = await api.patch(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getAllExercises(){
    try{
        const url = '/exercise/getAllExercises'
        const { data } = await api.get(url);
        const response = exerciseReceiveListSchemaFullDTO.safeParse(data);
        if(response.success){
            return response.data.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteExeciseById(id: Exercise['id']){
    try{
        const url = `/exercise/${id}`;
        const { data } = await api.delete(url);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getExerciseById(id: Exercise['id']){
    try{
        const url = `/exercise/${id}`;
        const { data } = await api.get(url);
        const response = getExerciseByIdSchema.safeParse(data);
        if(response.success){
            return response.data.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

