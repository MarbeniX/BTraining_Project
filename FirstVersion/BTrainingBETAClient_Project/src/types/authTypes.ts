import { z } from 'zod';

export const createAccountFormSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
})

export const getUserSchema = createAccountFormSchema.pick({
    email: true,
    username: true,
}).extend({
    admin: z.boolean(),
    id: z.string()
})

export type AuthCreateAccountForm = z.infer<typeof createAccountFormSchema>;
export type AuthLoginForm = Pick<AuthCreateAccountForm, 'email' | 'password'>;
export type AuthRequestCodeForm = Pick<AuthCreateAccountForm, 'email'>;
export type AuthUpdatePasswordForm = Pick<AuthCreateAccountForm, 'password' | 'passwordConfirm'>;
export type AuthGetUser = z.infer<typeof getUserSchema>;