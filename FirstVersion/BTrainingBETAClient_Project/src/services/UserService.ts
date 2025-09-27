import api from '@/lib/axios';
import { getUserSchema, type AuthUpdatePasswordForm } from '@/types/authTypes';
import { userGetProfilePictureSchema, type UserChangeUsernameForm, type UserProfilePicture } from '@/types/userTypes';
import { isAxiosError } from 'axios';


export async function changeUsername(formData : UserChangeUsernameForm){
    try{
        const url = '/user/change-username';
        const { data } = await api.post(url, formData);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function changePassword(formData: AuthUpdatePasswordForm){
    try{
        const url = '/user/change-password'
        const { data } = await api.post(url, formData);
        return data; 
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateProfilePicture(formData: UserProfilePicture){
    try{
        const formDataToSend = new FormData();
        formDataToSend.append('image', formData.image);
        
        const url = '/user/uploadProfilePicture'
        const { data } = await api.put(url, formDataToSend,{
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

export async function getUserProfileiPicture(){
    try{
        const url = '/user/getUserPp';
        const { data } = await api.get(url)
        const response = userGetProfilePictureSchema.safeParse(data);
        if(response.success){
            return response.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function getUser(){
    try{
        const url = '/user/user'
        const { data } = await api.get(url);
        const response = getUserSchema.safeParse(data)
        if(response.success){
            return response.data;
        }
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}