export interface User {
    userId: string;
    email: string;
    fullName: string;
    token: string;
    expiresAt: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
    crn: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  gender: string;
  activityLevel: string;
  targetWeight?: number;
  targetDate?: string;
  nutritionistId: string;
  createdAt: string;
  bmr: number;
  tdee: number;
  allergies: Allergy[];
  healthConditions: HealthCondition[];
  dietaryPreferences: DietaryPreference[];
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  // Alérgenos
  containsGluten: boolean;
  containsLactose: boolean;
  containsSoy: boolean;
  containsNuts: boolean;
  containsEggs: boolean;
  containsFish: boolean;
  containsShellfish: boolean;
  // Controle de saúde
  sugarContent: number;
  sodiumContent: number;
}

export interface Diet {
    id: string;
    createdDate: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    patientId: string;
    meals: Meal[];
}

export interface Meal {
    id: string;
    name: string;
    order: number;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    dietId: string;
    mealFoods: MealFood[];
}

export interface MealFood {
    id: string;
    quantity: number;
    calculatedCalories: number;
    calculatedProtein: number;
    calculatedCarbs: number;
    calculatedFat: number;
    mealId: string;
    foodId: string;
    foodName: string;
}

export interface Allergy {
  id: string;
  name: string;
  category: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
}

export interface DietaryPreference {
  id: string;
  name: string;
}

export interface WeightHistory {
  id: string;
  patientId: string;
  weight: number;
  bmi: number;
  measurementDate: string;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  patientId: string;
  measurementDate: string;
  neck?: number;
  chest?: number;
  waist?: number;
  abdomen?: number;
  hip?: number;
  rightArm?: number;
  leftArm?: number;
  rightThigh?: number;
  leftThigh?: number;
  rightCalf?: number;
  leftCalf?: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  notes?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDiets: number;
  totalWeightMeasurements: number;
  totalBodyMeasurements: number;
  patientsWithGoals: number;
  activePatientsThisMonth: number;
}

export interface PatientsByGoal {
  goal: string;
  count: number;
}

export interface PatientProgress {
  patientId: string;
  patientName: string;
  initialWeight: number;
  currentWeight: number;
  weightChange: number;
  daysSinceStart: number;
  weeklyAverage: number;
  firstMeasurementDate: string;
  lastMeasurementDate: string;
}

export interface InactivePatient {
  patientId: string;
  patientName: string;
  lastWeightMeasurement?: string;
  lastBodyMeasurement?: string;
  daysSinceLastMeasurement: number;
}

export interface BMIDistribution {
  category: string;
  count: number;
  [key: string]: string | number; 
}