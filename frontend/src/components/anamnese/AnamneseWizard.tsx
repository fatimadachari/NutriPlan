'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { CreateAnamneseDto } from '@/types/anamnese';
import anamneseService from '@/services/anamnese.service';
import { useRouter } from 'next/navigation';

interface AnamneseWizardProps {
    patientId: string;
    patientName: string;
}

export default function AnamneseWizard({ patientId, patientName }: AnamneseWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateAnamneseDto>({
        patientId,
        mainComplaint: '',
        consultationGoal: '',
        expectations: '',
        mealsPerDay: 3,
        waterIntakeLiters: 2,
        alcoholConsumption: 'Nunca',
        fastFoodFrequency: 'Nunca',
        sleepHoursPerDay: 8,
        stressLevel: 5,
        isSmoker: false,
        examFiles: [],
    });

    const updateField = (field: keyof CreateAnamneseDto, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await anamneseService.create(formData);
            router.push(`/dashboard/patients/${patientId}`);
        } catch (error) {
            console.error('Erro ao criar anamnese:', error);
            alert('Erro ao salvar anamnese');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const steps = [
        { number: 1, title: 'Objetivos' },
        { number: 2, title: 'Saúde' },
        { number: 3, title: 'Alimentação' },
        { number: 4, title: 'Estilo de Vida' },
        { number: 5, title: 'Observações' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step.number
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {currentStep > step.number ? <Check size={20} /> : step.number}
                                </div>
                                <span className="text-sm mt-2 font-medium">{step.title}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-1 flex-1 mx-4 ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Anamnese - {patientName}</CardTitle>
                    <CardDescription>
                        Preencha as informações do paciente - Etapa {currentStep} de 5
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: Objetivos */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="mainComplaint">Queixa Principal *</Label>
                                <Textarea
                                    id="mainComplaint"
                                    placeholder="Descreva a principal queixa do paciente..."
                                    value={formData.mainComplaint}
                                    onChange={(e) => updateField('mainComplaint', e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="consultationGoal">Objetivo da Consulta *</Label>
                                <Textarea
                                    id="consultationGoal"
                                    placeholder="Ex: Perder peso, ganhar massa muscular, melhorar saúde..."
                                    value={formData.consultationGoal}
                                    onChange={(e) => updateField('consultationGoal', e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="expectations">Expectativas</Label>
                                <Textarea
                                    id="expectations"
                                    placeholder="O que o paciente espera do acompanhamento..."
                                    value={formData.expectations}
                                    onChange={(e) => updateField('expectations', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Histórico de Saúde */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="familyHistory">Histórico Familiar</Label>
                                <Textarea
                                    id="familyHistory"
                                    placeholder="Doenças na família (diabetes, hipertensão, etc)..."
                                    value={formData.familyHistory || ''}
                                    onChange={(e) => updateField('familyHistory', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="preExistingDiseases">Doenças Pré-Existentes</Label>
                                <Textarea
                                    id="preExistingDiseases"
                                    placeholder="Doenças atuais do paciente..."
                                    value={formData.preExistingDiseases || ''}
                                    onChange={(e) => updateField('preExistingDiseases', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="previousSurgeries">Cirurgias Anteriores</Label>
                                <Textarea
                                    id="previousSurgeries"
                                    placeholder="Cirurgias realizadas..."
                                    value={formData.previousSurgeries || ''}
                                    onChange={(e) => updateField('previousSurgeries', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="currentMedications">Medicamentos em Uso</Label>
                                <Textarea
                                    id="currentMedications"
                                    placeholder="Medicamentos atuais e dosagem..."
                                    value={formData.currentMedications || ''}
                                    onChange={(e) => updateField('currentMedications', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="supplements">Suplementos</Label>
                                <Input
                                    id="supplements"
                                    placeholder="Suplementos em uso..."
                                    value={formData.supplements || ''}
                                    onChange={(e) => updateField('supplements', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="medicationAllergies">Alergias Medicamentosas</Label>
                                <Input
                                    id="medicationAllergies"
                                    placeholder="Alergias a medicamentos..."
                                    value={formData.medicationAllergies || ''}
                                    onChange={(e) => updateField('medicationAllergies', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Hábitos Alimentares */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="mealsPerDay">Refeições por Dia *</Label>
                                    <Input
                                        id="mealsPerDay"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.mealsPerDay}
                                        onChange={(e) => updateField('mealsPerDay', parseInt(e.target.value))}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="waterIntakeLiters">Consumo de Água (litros) *</Label>
                                    <Input
                                        id="waterIntakeLiters"
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="10"
                                        value={formData.waterIntakeLiters}
                                        onChange={(e) => updateField('waterIntakeLiters', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="mealTimes">Horários das Refeições</Label>
                                <Input
                                    id="mealTimes"
                                    placeholder="Ex: 7h, 12h, 15h, 19h..."
                                    value={formData.mealTimes || ''}
                                    onChange={(e) => updateField('mealTimes', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="foodPreferences">Preferências Alimentares</Label>
                                <Textarea
                                    id="foodPreferences"
                                    placeholder="Alimentos que gosta..."
                                    value={formData.foodPreferences || ''}
                                    onChange={(e) => updateField('foodPreferences', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="dislikedFoods">Alimentos que Não Gosta</Label>
                                <Textarea
                                    id="dislikedFoods"
                                    placeholder="Alimentos que não consome..."
                                    value={formData.dislikedFoods || ''}
                                    onChange={(e) => updateField('dislikedFoods', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="foodIntolerances">Intolerâncias Alimentares</Label>
                                <Textarea
                                    id="foodIntolerances"
                                    placeholder="Lactose, glúten, etc..."
                                    value={formData.foodIntolerances || ''}
                                    onChange={(e) => updateField('foodIntolerances', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="alcoholConsumption">Consumo de Álcool *</Label>
                                    <Select
                                        value={formData.alcoholConsumption}
                                        onValueChange={(value) => updateField('alcoholConsumption', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nunca">Nunca</SelectItem>
                                            <SelectItem value="Raramente">Raramente</SelectItem>
                                            <SelectItem value="Moderado">Moderado</SelectItem>
                                            <SelectItem value="Frequente">Frequente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="fastFoodFrequency">Fast Food *</Label>
                                    <Select
                                        value={formData.fastFoodFrequency}
                                        onValueChange={(value) => updateField('fastFoodFrequency', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nunca">Nunca</SelectItem>
                                            <SelectItem value="Raramente">Raramente</SelectItem>
                                            <SelectItem value="1-2x/semana">1-2x/semana</SelectItem>
                                            <SelectItem value="3+x/semana">3+x/semana</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Estilo de Vida */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="sleepHoursPerDay">Horas de Sono por Dia *</Label>
                                    <Input
                                        id="sleepHoursPerDay"
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="24"
                                        value={formData.sleepHoursPerDay}
                                        onChange={(e) => updateField('sleepHoursPerDay', parseFloat(e.target.value))}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="stressLevel">Nível de Estresse (1-10) *</Label>
                                    <Input
                                        id="stressLevel"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.stressLevel}
                                        onChange={(e) => updateField('stressLevel', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="physicalActivity">Atividade Física</Label>
                                <Textarea
                                    id="physicalActivity"
                                    placeholder="Tipo e frequência (Ex: Caminhada 3x/semana, Musculação 5x/semana)..."
                                    value={formData.physicalActivity || ''}
                                    onChange={(e) => updateField('physicalActivity', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="workRoutine">Rotina de Trabalho</Label>
                                <Textarea
                                    id="workRoutine"
                                    placeholder="Horário, tipo de trabalho, nível de atividade..."
                                    value={formData.workRoutine || ''}
                                    onChange={(e) => updateField('workRoutine', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isSmoker"
                                    checked={formData.isSmoker}
                                    onCheckedChange={(checked) => updateField('isSmoker', checked)}
                                />
                                <Label htmlFor="isSmoker" className="cursor-pointer">
                                    Fumante
                                </Label>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Exames & Observações */}
                    {currentStep === 5 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="previousDiets">Histórico de Dietas Anteriores</Label>
                                <Textarea
                                    id="previousDiets"
                                    placeholder="Dietas já realizadas e resultados..."
                                    value={formData.previousDiets || ''}
                                    onChange={(e) => updateField('previousDiets', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="additionalObservations">Observações Adicionais</Label>
                                <Textarea
                                    id="additionalObservations"
                                    placeholder="Qualquer informação relevante adicional..."
                                    value={formData.additionalObservations || ''}
                                    onChange={(e) => updateField('additionalObservations', e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Label>Upload de Exames (em breve)</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                                    <p>Funcionalidade de upload será implementada em breve</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Anterior
                        </Button>

                        {currentStep < 5 ? (
                            <Button type="button" onClick={nextStep}>
                                Próxima
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="button" onClick={handleSubmit} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Finalizar
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}