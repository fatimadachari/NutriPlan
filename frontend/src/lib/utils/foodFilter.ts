import { Food, Patient } from '@/types';

export interface FoodWarning {
  type: 'danger' | 'warning' | 'info';
  message: string;
}

export function checkFoodRestrictions(food: Food, patient: Patient): FoodWarning[] {
  const warnings: FoodWarning[] = [];

  console.log('Checando:', food.name, 'para paciente com', patient.allergies.length, 'alergias'); // DEBUG

  // Verificar alergias (PERIGO)
  patient.allergies.forEach((allergy) => {
    console.log('  - Verificando alergia:', allergy.name); // DEBUG
    
    if (allergy.name === 'Glúten' && food.containsGluten) {
      console.log('    ✅ MATCH: Contém glúten! food.containsGluten =', food.containsGluten); // DEBUG
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM GLÚTEN - Paciente tem intolerância!`,
      });
    } else if (allergy.name === 'Glúten') {
      console.log('    ❌ NO MATCH glúten: food.containsGluten =', food.containsGluten); // DEBUG
    }
    
    if (allergy.name === 'Lactose' && food.containsLactose) {
      console.log('    ✅ MATCH: Contém lactose! food.containsLactose =', food.containsLactose); // DEBUG
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM LACTOSE - Paciente tem intolerância!`,
      });
    } else if (allergy.name === 'Lactose') {
      console.log('    ❌ NO MATCH lactose: food.containsLactose =', food.containsLactose); // DEBUG
    }
    
    if (allergy.name === 'Soja' && food.containsSoy) {
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM SOJA - Paciente tem alergia!`,
      });
    }
    if ((allergy.name === 'Amendoim' || allergy.name === 'Castanhas') && food.containsNuts) {
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM OLEAGINOSAS - Paciente tem alergia!`,
      });
    }
    if (allergy.name === 'Ovo' && food.containsEggs) {
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM OVO - Paciente tem alergia!`,
      });
    }
    if (allergy.name === 'Peixe' && food.containsFish) {
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM PEIXE - Paciente tem alergia!`,
      });
    }
    if (allergy.name === 'Frutos do Mar' && food.containsShellfish) {
      warnings.push({
        type: 'danger',
        message: `⚠️ CONTÉM FRUTOS DO MAR - Paciente tem alergia!`,
      });
    }
  });

  console.log('  → Warnings encontrados:', warnings.length); // DEBUG

  // Verificar condições de saúde (AVISO)
  patient.healthConditions.forEach((condition) => {
    if ((condition.name.includes('Diabetes')) && food.sugarContent > 10) {
      warnings.push({
        type: 'warning',
        message: `⚠ ALTO TEOR DE AÇÚCAR (${food.sugarContent.toFixed(1)}g) - Atenção: paciente diabético`,
      });
    }
    if (condition.name.includes('Hipertensão') && food.sodiumContent > 400) {
      warnings.push({
        type: 'warning',
        message: `⚠ ALTO TEOR DE SÓDIO (${food.sodiumContent.toFixed(0)}mg) - Atenção: paciente hipertenso`,
      });
    }
  });

  // Verificar preferências alimentares (INFO)
  patient.dietaryPreferences.forEach((pref) => {
    if (pref.name === 'Vegetariano' && (food.name.toLowerCase().includes('carne') || food.name.toLowerCase().includes('frango') || food.containsFish)) {
      warnings.push({
        type: 'info',
        message: `ℹ️ Alimento de origem animal - Preferência: ${pref.name}`,
      });
    }
    if (pref.name === 'Vegano' && (food.containsLactose || food.containsEggs || food.name.toLowerCase().includes('carne') || food.name.toLowerCase().includes('frango') || food.containsFish)) {
      warnings.push({
        type: 'info',
        message: `ℹ️ Alimento de origem animal - Preferência: ${pref.name}`,
      });
    }
    if (pref.name === 'Low-Carb' && food.carbs > 20) {
      warnings.push({
        type: 'info',
        message: `ℹ️ ALTO EM CARBOIDRATOS (${food.carbs.toFixed(1)}g) - Preferência: Low-Carb`,
      });
    }
  });

  return warnings;
}

export function shouldBlockFood(warnings: FoodWarning[]): boolean {
  return warnings.some(w => w.type === 'danger');
}

export function filterSafeFoods(foods: Food[], patient: Patient): Food[] {
  return foods.filter(food => {
    const warnings = checkFoodRestrictions(food, patient);
    return !shouldBlockFood(warnings);
  });
}