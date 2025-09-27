import { z } from 'zod';
import { exerciseSchema } from './exerciseTypes';

export const routineCategorySchema = z.enum([
    'PULL',
    'PUSH',
    'LEG',
    'CHEST',
    'BACK',
    'CORE',
    'ARMS',
    'FREE',
])

export type RoutineCategory = z.infer<typeof routineCategorySchema>
export const routineCategoryArray = routineCategorySchema.options;

export const categoryColormap: Record<RoutineCategory, string> = {
    PULL: '#edede9',
    PUSH: '#001d3d',
    LEG: '#ca6702',
    CHEST: '#e9d8a6',
    BACK: '#ee9b00',
    CORE: '#ae2012',
    ARMS: '#582c4d',
    FREE: '#9b2226',
}

export const routineSchema = z.object({
    name: z.string().min(3),
    description: z.string().max(200).optional(),
    category: routineCategorySchema
})

export const routineResponseSchema = routineSchema.extend({
    id: z.string(),
    creationDate: z.string(),
    userId: z.string(),
    exercises: z.array(exerciseSchema)
})

export const routineListResponseSchema = z.array(routineResponseSchema)

export const GetRoutoinesResponseSchema = z.object({
    data: z.array(routineResponseSchema),
    message: z.string(),
    success: z.boolean(),
})

export const getRoutineByIdResponseSchema = z.object({
    data: routineResponseSchema,
    message: z.string(),
    success: z.boolean(),
})

export const routineSearchRoutineSchema = z.object({
    id: z.string(),
    name: z.string()
})

export const routineSearchListRoutineSchema = z.array(routineSearchRoutineSchema)

export type RoutineCreateForm = z.infer<typeof routineSchema>
export type Routine = z.infer<typeof routineResponseSchema>
export type RoutineUpdateForm = z.infer<typeof routineSchema>
export type RoutineGetResponse = z.infer<typeof GetRoutoinesResponseSchema>
export type RoutineNameAndId = z.infer<typeof routineSearchRoutineSchema>
