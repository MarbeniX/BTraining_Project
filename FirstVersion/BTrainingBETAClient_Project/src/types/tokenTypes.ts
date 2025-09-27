import { z } from 'zod';

/**Token */
export const tokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    token: z.string(),
    createdAt: z.date()
})

export type Token = z.infer<typeof tokenSchema>
export type TokenConfirmAccountForm = Pick<Token, 'token'>;
