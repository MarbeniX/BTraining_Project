import api from '@/lib/axios';
import { isAxiosError } from 'axios';
import { type AuthCreateAccountForm, type AuthLoginForm, type AuthRequestCodeForm, type AuthUpdatePasswordForm } from '@/types/authTypes';
import type { TokenConfirmAccountForm } from '@/types/tokenTypes';

export async function createAccount(formData : AuthCreateAccountForm){
    try{
        const url = '/auth/create-account';
        const { data } = await api.post(url, formData);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function confirmAccount(token: TokenConfirmAccountForm['token']) {
    try{
        const url = `/auth/${token}`
        const { data } = await api.post(url, token);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
} 

export async function login(formData: AuthLoginForm){
    try{
        const url = '/auth/login';
        const { data } = await api.post(url, formData)
        localStorage.setItem('AUTH_TOKEN', data.data)
        return data.message;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function requestCode(formData: AuthRequestCodeForm){
    try{
        const url = '/auth/req-code'
        const { data } = await api.post(url, formData);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function requestPasswordCode(formData: AuthRequestCodeForm){
    try{
        const url = 'auth/req-passreset-code'
        const { data } = await api.post(url, formData)
        return data.message;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function updatePassword({formData, token} : {formData: AuthUpdatePasswordForm, token: TokenConfirmAccountForm['token']}) {
    try{
        const url = `/auth/update-password/${token}`
        const { data } = await api.post(url, formData)
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export async function validateToken(token: TokenConfirmAccountForm){
    try{
        const url = `/auth/${token}`
        const { data } = await api.get(url);
        return data;
    }catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}