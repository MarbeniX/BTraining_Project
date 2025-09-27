import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
})

export const userGetProfilePictureSchema = z.object({
    url: z.string(),
    publicID: z.string().optional()
})

export interface UserProfilePicture {
    image: File;
}

export type User = z.infer<typeof userSchema>;
export type UserChangeUsernameForm = Pick<User, 'username'>;