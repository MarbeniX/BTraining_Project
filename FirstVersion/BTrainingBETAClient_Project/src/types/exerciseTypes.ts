import { z } from "zod";

export const exerciseMuscleSchema = z.enum([
    'SHOULDER', 
    'BICEP', 
    'TRICEP', 
    'FOREARM', 
    'CHEST', 
    'BACK', 
    'LEG', 
    'ASS', 
    'CORE', 
    'OTHER'
]); 

export type ExerciseMuscle = z.infer<typeof exerciseMuscleSchema>
export const exerciseMuscleArray = exerciseMuscleSchema.options

export const muscleColorMap: Record<ExerciseMuscle, string> = {
    SHOULDER: '#001219',
    BICEP: '#005f73',
    TRICEP: '#0a9396',
    FOREARM: '#94d2bd',
    CHEST: '#e9d8a6',
    BACK: '#ee9b00',
    LEG: '#ca6702',
    ASS: '#bb3e03',
    CORE: '#ae2012',
    OTHER: '#9b2226',
};

export const exerciseDifficultySchema = z.enum([
    'BEGINNER1',
    'BEGINNER2',
    'BEGINNER3',
    'INTERMEDIATE1',
    'INTERMEDIATE2',
    'INTERMEDIATE3',
    'ADVANCED1',
    'ADVANCED2',
    'ADVANCED3',
    'OPEN',
]);

export type ExerciseDifficulty = z.infer<typeof exerciseDifficultySchema>;
export const exerciseDifficultyArray = exerciseDifficultySchema.options

export const difficultyColorMap: Record<ExerciseDifficulty, string> = {
    BEGINNER1: '#ffb3c1',
    BEGINNER2: '#ff8fa3',
    BEGINNER3: '#ff758f',
    INTERMEDIATE1: '#90caf9',
    INTERMEDIATE2: '#64b5f6',
    INTERMEDIATE3: '#42a5f5',
    ADVANCED1: '#e0aaff',
    ADVANCED2: '#c77dff',
    ADVANCED3: '#9d4edd',
    OPEN: '#dceab2',
};

export const exerciseSchema = z.object({
    id: z.string(),
    description: z.string().max(250).optional(),
    title: z.string(),
    muscle: exerciseMuscleSchema,
    difficulty: exerciseDifficultySchema,
    imageURL: z.string().url().optional(),
    publicID: z.string().optional()
})

export const getExerciseByIdSchema = z.object({
    data: exerciseSchema,
    message: z.string(),
    success: z.boolean(),
})

export interface ExerciseForm {
    description: string;
    title: string;
    muscle: ExerciseMuscle;
    difficulty: ExerciseDifficulty;
    image?: FileList;
}

export const exerciseReceiveSchema = exerciseSchema.pick({
    id: true,
    title: true,
    description: true,
    imageURL: true,
    muscle: true,
    difficulty: true,
})

export const actualExerciseTrainingSchema =exerciseReceiveSchema.pick({
    id: true,
    title: true,
})

export const exerciseReceiveListSchema = z.array(exerciseReceiveSchema)

export const exerciseReceiveListSchemaFullDTO = z.object({
    data: exerciseReceiveListSchema,
    message: z.string(),
    success: z.boolean(),
})

export type Exercise = z.infer<typeof exerciseSchema>
export type ExerciseReceive = z.infer<typeof exerciseReceiveSchema>
export type ActualExerciseTraining = z.infer<typeof actualExerciseTrainingSchema>