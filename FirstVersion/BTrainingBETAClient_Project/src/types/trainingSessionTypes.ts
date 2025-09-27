import { z } from 'zod';

export const trainingSessionExerciseSchema = z.object({
    exerciseId: z.string(),
    timeToComplete: z.number(),
    setNumber: z.number(),
    reps: z.number(),
    trainingSessionId: z.string(),
})

export const trainingSessionExerciseListSchema = z.array(trainingSessionExerciseSchema);

export const trainingSessionSchema = z.object({
    id: z.string(),
    exercises: trainingSessionExerciseListSchema,
    trainingDate: z.string(),
    userId: z.string(),
    routineId: z.string().optional(),
})

export const getTrainingSessionMarksSchema = z.object({
    exerciseId: z.string(),
    markId: z.string(),
    reps: z.number(),
    setNumber: z.number(),
    timeToComplete: z.number().min(0),
})

export const getTrainingSessionByIdSchema = z.object({
    marks: z.array(getTrainingSessionMarksSchema).optional(),
    routineId: z.string().optional(),
    sessionId: z.string(),
    trainingDate: z.string(),
})

export const getAllTrainingSessionListResponseSchema = z.object({
    data: z.array(getTrainingSessionByIdSchema),
    message: z.string(),
    success: z.boolean(),
})

export const searchTrainingSessionFilterSchema = z.enum([
    '1week',
    '2weeks',
    '3weeks',
    '1month',
    '3months',
    'all'
])

export const trainingSessionExerciseCompSchema = trainingSessionExerciseSchema.extend({
    title: z.string(),
})

export type TrainingSessionExercise = z.infer<typeof trainingSessionExerciseSchema>;
export type TrainingSession = z.infer<typeof trainingSessionSchema>;
export type TrainingSessionExerciseList = z.infer<typeof trainingSessionExerciseListSchema>;
export type TrainingSessionMarks = z.infer<typeof getTrainingSessionMarksSchema>;
export type TrainingSessionSearchFilter = z.infer<typeof searchTrainingSessionFilterSchema>;
export type TrainingSessionExerciseComp = z.infer<typeof trainingSessionExerciseCompSchema>;
export type GetTrainingSessionById = z.infer<typeof getTrainingSessionByIdSchema>;