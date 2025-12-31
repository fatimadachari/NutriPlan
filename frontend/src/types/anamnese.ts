export interface CreateAnamneseDto {
    patientId: string;

    // Step 1: Dados Pessoais & Objetivos
    mainComplaint: string;
    consultationGoal: string;
    expectations: string;

    // Step 2: Histórico de Saúde
    familyHistory?: string;
    preExistingDiseases?: string;
    previousSurgeries?: string;
    currentMedications?: string;
    supplements?: string;
    medicationAllergies?: string;

    // Step 3: Hábitos Alimentares
    mealsPerDay: number;
    mealTimes?: string;
    foodPreferences?: string;
    dislikedFoods?: string;
    foodIntolerances?: string;
    waterIntakeLiters: number;
    alcoholConsumption: string;
    fastFoodFrequency: string;

    // Step 4: Estilo de Vida
    sleepHoursPerDay: number;
    stressLevel: number;
    physicalActivity?: string;
    workRoutine?: string;
    isSmoker: boolean;

    // Step 5: Exames & Observações
    previousDiets?: string;
    additionalObservations?: string;
    examFiles: string[];
}

export interface UpdateAnamneseDto {
    mainComplaint?: string;
    consultationGoal?: string;
    expectations?: string;
    familyHistory?: string;
    preExistingDiseases?: string;
    previousSurgeries?: string;
    currentMedications?: string;
    supplements?: string;
    medicationAllergies?: string;
    mealsPerDay?: number;
    mealTimes?: string;
    foodPreferences?: string;
    dislikedFoods?: string;
    foodIntolerances?: string;
    waterIntakeLiters?: number;
    alcoholConsumption?: string;
    fastFoodFrequency?: string;
    sleepHoursPerDay?: number;
    stressLevel?: number;
    physicalActivity?: string;
    workRoutine?: string;
    isSmoker?: boolean;
    previousDiets?: string;
    additionalObservations?: string;
    examFiles?: string[];
}

export interface AnamneseResponseDto {
    id: string;
    patientId: string;
    patientName: string;

    mainComplaint: string;
    consultationGoal: string;
    expectations: string;

    familyHistory?: string;
    preExistingDiseases?: string;
    previousSurgeries?: string;
    currentMedications?: string;
    supplements?: string;
    medicationAllergies?: string;

    mealsPerDay: number;
    mealTimes?: string;
    foodPreferences?: string;
    dislikedFoods?: string;
    foodIntolerances?: string;
    waterIntakeLiters: number;
    alcoholConsumption: string;
    fastFoodFrequency: string;

    sleepHoursPerDay: number;
    stressLevel: number;
    physicalActivity?: string;
    workRoutine?: string;
    isSmoker: boolean;

    previousDiets?: string;
    additionalObservations?: string;
    examFiles: string[];

    createdAt: string;
    updatedAt?: string;
}