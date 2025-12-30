'use client';

import { Patient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Target, TrendingDown, TrendingUp, Calendar, Flame } from 'lucide-react';

interface MetabolicInfoCardProps {
  patient: Patient;
  latestWeight?: number;
}

export default function MetabolicInfoCard({ patient, latestWeight }: MetabolicInfoCardProps) {
  const currentWeight = latestWeight || patient.weight;
  
  const getActivityLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'Sedentary': 'Sedentário',
      'Light': 'Leve',
      'Moderate': 'Moderado',
      'Active': 'Ativo',
      'VeryActive': 'Muito Ativo',
    };
    return labels[level] || level;
  };

  const calculateWeightDifference = () => {
    if (!patient.targetWeight) return null;
    return patient.targetWeight - currentWeight;
  };

  const calculateDaysToTarget = () => {
    if (!patient.targetDate) return null;
    const today = new Date();
    const target = new Date(patient.targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateWeeklyWeightChange = () => {
    const weightDiff = calculateWeightDifference();
    const daysToTarget = calculateDaysToTarget();
    
    if (!weightDiff || !daysToTarget || daysToTarget <= 0) return null;
    
    const weeksToTarget = daysToTarget / 7;
    return weightDiff / weeksToTarget;
  };

  const getRecommendedCalories = () => {
    const weightDiff = calculateWeightDifference();
    const weeklyChange = calculateWeeklyWeightChange();
    
    if (!weightDiff || !weeklyChange) return null;
    
    // 1kg de gordura = ~7700 calorias
    // Deficit/superavit diário = (mudança semanal * 7700) / 7
    const dailyCalorieChange = (weeklyChange * 7700) / 7;
    const recommendedCalories = patient.tdee + dailyCalorieChange;
    
    return Math.round(recommendedCalories);
  };

  const weightDiff = calculateWeightDifference();
  const daysToTarget = calculateDaysToTarget();
  const weeklyChange = calculateWeeklyWeightChange();
  const recommendedCalories = getRecommendedCalories();

  return (
    <div className="space-y-4">
      {/* Cards de Métricas Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Flame className="mr-2 h-4 w-4 text-orange-500" />
              TMB (Taxa Metabólica Basal)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{patient.bmr.toFixed(0)} kcal</p>
            <p className="text-xs text-gray-600 mt-1">Calorias em repouso absoluto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="mr-2 h-4 w-4 text-blue-500" />
              TDEE (Gasto Calórico Total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{patient.tdee.toFixed(0)} kcal</p>
            <p className="text-xs text-gray-600 mt-1">
              {getActivityLevelLabel(patient.activityLevel)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="mr-2 h-4 w-4 text-green-500" />
              Peso Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentWeight.toFixed(1)} kg</p>
            {patient.targetWeight && (
              <p className="text-xs text-gray-600 mt-1">
                Meta: {patient.targetWeight.toFixed(1)} kg
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card de Meta de Peso */}
      {patient.targetWeight && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-purple-600" />
              Plano de Meta de Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Diferença de Peso */}
              <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
                <div className={`p-2 rounded-full ${weightDiff && weightDiff < 0 ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {weightDiff && weightDiff < 0 ? (
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Diferença de Peso</p>
                  <p className="text-2xl font-bold">
                    {weightDiff ? `${Math.abs(weightDiff).toFixed(1)} kg` : '--'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {weightDiff && weightDiff < 0 ? 'a perder' : 'a ganhar'}
                  </p>
                </div>
              </div>

              {/* Dias Restantes */}
              {patient.targetDate && (
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prazo</p>
                    <p className="text-2xl font-bold">
                      {daysToTarget ? `${daysToTarget} dias` : '--'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      até {new Date(patient.targetDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recomendações */}
            {weeklyChange && recommendedCalories && (
              <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                <h4 className="font-semibold mb-3 text-purple-900">
                  📊 Recomendações para Atingir a Meta
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mudança semanal necessária:</span>
                    <span className="font-semibold">
                      {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(2)} kg/semana
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calorias diárias recomendadas:</span>
                    <span className="font-semibold text-purple-700">
                      {recommendedCalories} kcal
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {weightDiff && weightDiff < 0 ? 'Déficit' : 'Superávit'} calórico diário:
                    </span>
                    <span className={`font-semibold ${weightDiff && weightDiff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.abs(patient.tdee - recommendedCalories).toFixed(0)} kcal
                    </span>
                  </div>
                </div>
                
                {/* Avisos */}
                {weeklyChange && Math.abs(weeklyChange) > 1 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      ⚠️ <strong>Atenção:</strong> A mudança semanal recomendada está acima de 1kg/semana. 
                      Para resultados saudáveis e sustentáveis, considere ajustar a data meta ou a meta de peso.
                    </p>
                  </div>
                )}
                
                {recommendedCalories < 1200 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-800">
                      🚨 <strong>Alerta:</strong> O déficit calórico necessário resulta em menos de 1200 kcal/dia, 
                      o que não é recomendado. Ajuste a meta para um objetivo mais saudável.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Card Informativo se não tem meta */}
      {!patient.targetWeight && (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="py-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Nenhuma meta de peso definida</p>
            <p className="text-sm text-gray-500">
              Defina uma meta para receber recomendações personalizadas de calorias
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}