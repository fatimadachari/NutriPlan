'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Check, Loader2, ClipboardCheck, Sparkles, HeartPulse, Refrigerator, Zap } from 'lucide-react';
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

    const steps = [
        { number: 1, title: 'Objetivos', icon: Sparkles },
        { number: 2, title: 'Saúde', icon: HeartPulse },
        { number: 3, title: 'Alimentação', icon: Refrigerator },
        { number: 4, title: 'Estilo de Vida', icon: Zap },
        { number: 5, title: 'Observações', icon: ClipboardCheck },
    ];

    const updateField = (field: keyof CreateAnamneseDto, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await anamneseService.create(formData);
            router.push(`/dashboard/patients/${patientId}`);
        } catch (error) {
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* --- CUSTOM STEPPER --- */}
            <div className="mb-12 relative">
                <div className="flex items-center justify-between relative z-10">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep >= step.number;
                        const isCurrent = currentStep === step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center group">
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                                    ${isActive 
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] rotate-0' 
                                        : 'bg-white border-slate-100 text-slate-300 rotate-3'}
                                    ${isCurrent ? 'scale-110' : 'scale-100'}
                                `}>
                                    {currentStep > step.number ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                                </div>
                                <span className={`text-[10px] mt-3 font-black uppercase tracking-widest transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-300'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {/* Background Progress Line */}
                <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-100 -z-0">
                    <div 
                        className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* --- MAIN FORM CARD --- */}
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
                <div className="bg-slate-50 px-10 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Anamnese Digital</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente: {patientName}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                        Etapa {currentStep} / 5
                    </span>
                </div>

                <CardContent className="p-10 space-y-8">
                    {/* Step 1: Objetivos */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Queixa Principal *</Label>
                                <Textarea
                                    placeholder="O que trouxe o paciente até aqui?"
                                    className="rounded-2xl bg-slate-50 border-none min-h-[120px] font-medium p-5 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    value={formData.mainComplaint}
                                    onChange={(e) => updateField('mainComplaint', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Objetivo da Consulta *</Label>
                                <Input
                                    placeholder="Ex: Emagrecimento, Hipertrofia..."
                                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-5"
                                    value={formData.consultationGoal}
                                    onChange={(e) => updateField('consultationGoal', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Saúde */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Histórico Familiar</Label>
                                    <Textarea className="rounded-2xl bg-slate-50 border-none font-medium" rows={4} value={formData.familyHistory} onChange={(e) => updateField('familyHistory', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Doenças Pré-Existentes</Label>
                                    <Textarea className="rounded-2xl bg-slate-50 border-none font-medium" rows={4} value={formData.preExistingDiseases} onChange={(e) => updateField('preExistingDiseases', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Medicamentos em Uso</Label>
                                <Input className="h-14 rounded-2xl bg-slate-50 border-none font-bold" value={formData.currentMedications} onChange={(e) => updateField('currentMedications', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Alimentação */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Refeições p/ Dia</Label>
                                    <Input type="number" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-lg" value={formData.mealsPerDay} onChange={(e) => updateField('mealsPerDay', parseInt(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Água (Litros)</Label>
                                    <Input type="number" step="0.5" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-lg" value={formData.waterIntakeLiters} onChange={(e) => updateField('waterIntakeLiters', parseFloat(e.target.value))} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Frequência de Fast Food</Label>
                                <Select value={formData.fastFoodFrequency} onValueChange={(v) => updateField('fastFoodFrequency', v)}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="Nunca">Nunca consome</SelectItem>
                                        <SelectItem value="Raramente">Raramente (1x ao mês)</SelectItem>
                                        <SelectItem value="1-2x/semana">Ocasional (1-2x semana)</SelectItem>
                                        <SelectItem value="3+x/semana">Frequente (3+x semana)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Estilo de Vida */}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Horas de Sono</Label>
                                    <Input type="number" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-lg" value={formData.sleepHoursPerDay} onChange={(e) => updateField('sleepHoursPerDay', parseFloat(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-1">Nível de Estresse (1-10)</Label>
                                    <Input type="number" min="1" max="10" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-lg" value={formData.stressLevel} onChange={(e) => updateField('stressLevel', parseInt(e.target.value))} />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <Checkbox 
                                    id="smoker" 
                                    className="w-6 h-6 rounded-lg border-2 border-emerald-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                    checked={formData.isSmoker} 
                                    onCheckedChange={(c) => updateField('isSmoker', c)} 
                                />
                                <Label htmlFor="smoker" className="text-sm font-black uppercase tracking-tighter text-slate-700 cursor-pointer">Paciente faz uso de tabaco?</Label>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Finalização */}
                    {currentStep === 5 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 text-center py-10">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Tudo pronto!</h3>
                            <p className="text-slate-400 font-medium max-w-xs mx-auto">Revise as informações se necessário antes de salvar permanentemente no prontuário.</p>
                            
                            <div className="pt-10 space-y-4 max-w-md mx-auto">
                                <Textarea 
                                    placeholder="Observações adicionais internas..." 
                                    className="rounded-2xl bg-slate-50 border-none font-medium p-5"
                                    value={formData.additionalObservations}
                                    onChange={(e) => updateField('additionalObservations', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- NAVIGATION BUTTONS --- */}
                    <div className="flex justify-between items-center pt-10 mt-10 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => currentStep === 1 ? router.back() : setCurrentStep(v => v - 1)}
                            className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> 
                            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
                        </Button>

                        <Button 
                            type="button" 
                            onClick={currentStep === 5 ? handleSubmit : () => setCurrentStep(v => v + 1)}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    {currentStep === 5 ? 'Salvar Anamnese' : 'Próxima Etapa'}
                                    {currentStep !== 5 && <ArrowRight className="ml-2 h-4 w-4" />}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}