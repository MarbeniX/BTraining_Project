import type { Routine, RoutineNameAndId, RoutineUpdateForm } from '@/types/routineTypes';
import { create } from 'zustand';

type RoutineFormState = {
    showCreateRoutineForm: boolean;
    showAddExerciseForm: boolean;
    showDeleteRoutineConfrmationForm: boolean;
    showViewRoutineDetails?: boolean
    showSaveChangesConfirmationForm: boolean
    showSearchRoutinesBar: boolean,
    showHowDoYouWantToTrainPopUp: boolean,
    modeHowDoYouWantToTrain: boolean,
    routineId: Routine['id']
    updateRoutineFormData: RoutineUpdateForm | null,
    editMode: boolean,
    adminPage: boolean,
    routineNameAndIdTraining: RoutineNameAndId

    openCreateRoutineForm: () => void;
    closeCreateRoutineForm: () => void;
    setShowAddExerciseForm: (value: boolean) => void;
    setRoutineId: (id: Routine['id']) => void;
    setShowDeleteRoutineConfrmationForm: (value: boolean) => void;
    setShowViewRoutineDetails: (value: boolean) => void;
    setShowSaveChangesConfirmationForm: (value: boolean) => void;
    setUpdateRoutineFormData: (id: Routine['id'], formData: RoutineUpdateForm) => void;
    setEditMode: (value: boolean) => void;
    setAdminPage: (value: boolean) => void;
    setShowSearchRoutinesBar: (value: boolean) => void;
    setShowHowDoYouWantToTrain: (value: boolean) => void;
    setModeHowDoYouWantToTrain: (value: boolean) => void,
    setRoutineNameAndIdTraining: (id: Routine['id'], name: Routine['name']) => void
}

export const useRoutineFormStore = create<RoutineFormState>((set) => ({
    showCreateRoutineForm: false, 
    showAddExerciseForm: false,
    showDeleteRoutineConfrmationForm: false,
    showSaveChangesConfirmationForm: false,
    showSearchRoutinesBar: false,
    showHowDoYouWantToTrainPopUp: false,
    modeHowDoYouWantToTrain: false,
    routineId: '',
    updateRoutineFormData: null,
    editMode: false,
    adminPage: false,
    routineNameAndIdTraining: { id: '', name: '' },

    openCreateRoutineForm: () => set({ showCreateRoutineForm: true}),
    closeCreateRoutineForm: () => set({ showCreateRoutineForm: false}),
    setShowAddExerciseForm: (value) => set({ showAddExerciseForm: value }),
    setRoutineId: (id) => set({ routineId: id }),
    setShowDeleteRoutineConfrmationForm: (value) => set({ showDeleteRoutineConfrmationForm: value}),
    setShowViewRoutineDetails: (value) => set({ showViewRoutineDetails: value}),
    setShowSaveChangesConfirmationForm: (value) => set({ showSaveChangesConfirmationForm: value }),
    setUpdateRoutineFormData: (id, updateRoutineFormData) => set({routineId: id, updateRoutineFormData, showSaveChangesConfirmationForm: true}),
    setEditMode: (value) => set({ editMode: value}),
    setAdminPage: (value) => set({ adminPage: value }),
    setShowSearchRoutinesBar: (value) => set({ showSearchRoutinesBar: value }),
    setShowHowDoYouWantToTrain: (value) => set({ showHowDoYouWantToTrainPopUp: value}),
    setModeHowDoYouWantToTrain: (value) => set({ modeHowDoYouWantToTrain: value }),
    setRoutineNameAndIdTraining: (id, name) => set({ routineNameAndIdTraining: { id, name } })
}))