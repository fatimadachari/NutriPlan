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
    nutritionistId: string;
    createdAt: string;
}

export interface Food {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
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