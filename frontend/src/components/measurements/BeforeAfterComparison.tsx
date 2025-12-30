'use client';

import { BodyMeasurement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface BeforeAfterComparisonProps {
  first: BodyMeasurement;
  latest: BodyMeasurement;
}

export default function BeforeAfterComparison({ first, latest }: BeforeAfterComparisonProps) {
  const calculateDifference = (firstValue?: number, latestValue?: number) => {
    if (!firstValue || !latestValue) return null;
    return latestValue - firstValue;
  };

  const measurements = [
    { key: 'neck', label: 'Pescoço', firstValue: first.neck, latestValue: latest.neck },
    { key: 'chest', label: 'Peitoral', firstValue: first.chest, latestValue: latest.chest },
    { key: 'waist', label: 'Cintura', firstValue: first.waist, latestValue: latest.waist },
    { key: 'abdomen', label: 'Abdômen', firstValue: first.abdomen, latestValue: latest.abdomen },
    { key: 'hip', label: 'Quadril', firstValue: first.hip, latestValue: latest.hip },
    { key: 'rightArm', label: 'Braço Direito', firstValue: first.rightArm, latestValue: latest.rightArm },
    { key: 'leftArm', label: 'Braço Esquerdo', firstValue: first.leftArm, latestValue: latest.leftArm },
    { key: 'rightThigh', label: 'Coxa Direita', firstValue: first.rightThigh, latestValue: latest.rightThigh },
    { key: 'leftThigh', label: 'Coxa Esquerda', firstValue: first.leftThigh, latestValue: latest.leftThigh },
    { key: 'rightCalf', label: 'Panturrilha Direita', firstValue: first.rightCalf, latestValue: latest.rightCalf },
    { key: 'leftCalf', label: 'Panturrilha Esquerda', firstValue: first.leftCalf, latestValue: latest.leftCalf },
  ].filter(m => m.firstValue !== undefined && m.latestValue !== undefined);

  const bodyComposition = [
    { key: 'bodyFatPercentage', label: '% Gordura Corporal', firstValue: first.bodyFatPercentage, latestValue: latest.bodyFatPercentage, suffix: '%' },
    { key: 'muscleMassPercentage', label: '% Massa Muscular', firstValue: first.muscleMassPercentage, latestValue: latest.muscleMassPercentage, suffix: '%' },
  ].filter(m => m.firstValue !== undefined && m.latestValue !== undefined);

  const renderDifference = (diff: number | null, suffix: string = 'cm') => {
    if (diff === null) return null;
    
    const isPositive = diff > 0;
    const isNeutral = diff === 0;

    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${
        isNeutral ? 'text-gray-600' : isPositive ? 'text-orange-600' : 'text-green-600'
      }`}>
        {isNeutral ? (
          <Minus size={16} />
        ) : isPositive ? (
          <TrendingUp size={16} />
        ) : (
          <TrendingDown size={16} />
        )}
        {isPositive ? '+' : ''}{diff.toFixed(1)}{suffix}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Circunferências */}
      {measurements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Circunferências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {measurements.map((measurement) => {
                const diff = calculateDifference(measurement.firstValue, measurement.latestValue);
                return (
                  <div key={measurement.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{measurement.label}</p>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Inicial</p>
                        <p className="font-semibold">{measurement.firstValue?.toFixed(1)} cm</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        {renderDifference(diff)}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Atual</p>
                        <p className="font-semibold">{measurement.latestValue?.toFixed(1)} cm</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Composição Corporal */}
      {bodyComposition.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Composição Corporal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bodyComposition.map((measurement) => {
                const diff = calculateDifference(measurement.firstValue, measurement.latestValue);
                return (
                  <div key={measurement.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{measurement.label}</p>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Inicial</p>
                        <p className="font-semibold">{measurement.firstValue?.toFixed(1)}{measurement.suffix}</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        {renderDifference(diff, measurement.suffix)}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Atual</p>
                        <p className="font-semibold">{measurement.latestValue?.toFixed(1)}{measurement.suffix}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}