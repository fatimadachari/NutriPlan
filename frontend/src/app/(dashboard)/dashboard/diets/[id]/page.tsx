'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dietsApi, mealsApi, mealFoodsApi } from '@/lib/api/diets';
import { foodsApi } from '@/lib/api/foods';
import { Diet, Food } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, FileDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function DietEditPage() {
  const params = useParams();
  const router = useRouter();
  const dietId = params.id as string;

  const [diet, setDiet] = useState<Diet | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog de Nova Refeição
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealOrder, setMealOrder] = useState('');
  
  // Dialog de Adicionar Alimento
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [foodQuantity, setFoodQuantity] = useState('');
  const [foodSearch, setFoodSearch] = useState('');

  useEffect(() => {
    loadDiet();
    loadFoods();
  }, [dietId]);

  const loadDiet = async () => {
    try {
      const data = await dietsApi.getById(dietId);
      setDiet(data);
    } catch (error) {
      console.error('Erro ao carregar dieta:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFoods = async () => {
    try {
      const data = await foodsApi.getAll();
      setFoods(data);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
    }
  };

  const handleCreateMeal = async () => {
    try {
      await mealsApi.create({
        name: mealName,
        order: parseInt(mealOrder),
        dietId,
      });
      setMealDialogOpen(false);
      setMealName('');
      setMealOrder('');
      loadDiet();
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (confirm('Tem certeza que deseja excluir esta refeição?')) {
      try {
        await mealsApi.delete(mealId);
        loadDiet();
      } catch (error) {
        console.error('Erro ao excluir refeição:', error);
      }
    }
  };

  const handleAddFood = async () => {
    try {
      await mealFoodsApi.addFood({
        mealId: selectedMealId,
        foodId: selectedFoodId,
        quantity: parseInt(foodQuantity),
      });
      setFoodDialogOpen(false);
      setSelectedFoodId('');
      setFoodQuantity('');
      setFoodSearch('');
      loadDiet();
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
    }
  };

  const handleRemoveFood = async (mealFoodId: string) => {
    try {
      await mealFoodsApi.remove(mealFoodId);
      loadDiet();
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await dietsApi.downloadPdf(dietId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dieta-${dietId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!diet) {
    return <div>Dieta não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Dieta</h1>
            <p className="text-gray-600 mt-1">
              Criada em {new Date(diet.createdDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownloadPdf}>
            <FileDown className="mr-2" size={20} />
            Baixar PDF
          </Button>
          <Button onClick={() => setMealDialogOpen(true)}>
            <Plus className="mr-2" size={20} />
            Nova Refeição
          </Button>
        </div>
      </div>

      {/* Resumo Nutricional */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle>Resumo Nutricional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Calorias Totais</p>
              <p className="text-2xl font-bold text-green-600">
                {diet.totalCalories.toFixed(1)} kcal
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Proteínas</p>
              <p className="text-2xl font-bold">{diet.totalProtein.toFixed(1)}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Carboidratos</p>
              <p className="text-2xl font-bold">{diet.totalCarbs.toFixed(1)}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gorduras</p>
              <p className="text-2xl font-bold">{diet.totalFat.toFixed(1)}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refeições */}
      {diet.meals.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Nenhuma refeição adicionada ainda.</p>
              <Button onClick={() => setMealDialogOpen(true)}>
                <Plus className="mr-2" size={20} />
                Adicionar Primeira Refeição
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {diet.meals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{meal.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {meal.totalCalories.toFixed(1)} kcal | P: {meal.totalProtein.toFixed(1)}g | C:{' '}
                      {meal.totalCarbs.toFixed(1)}g | G: {meal.totalFat.toFixed(1)}g
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMealId(meal.id);
                        setFoodDialogOpen(true);
                      }}
                    >
                      <Plus size={16} className="mr-1" />
                      Alimento
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {meal.mealFoods.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    Nenhum alimento adicionado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {meal.mealFoods.map((mealFood) => (
                      <div
                        key={mealFood.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{mealFood.foodName}</p>
                          <p className="text-sm text-gray-600">
                            {mealFood.quantity}g | {mealFood.calculatedCalories.toFixed(1)} kcal |
                            P: {mealFood.calculatedProtein.toFixed(1)}g | C:{' '}
                            {mealFood.calculatedCarbs.toFixed(1)}g | G:{' '}
                            {mealFood.calculatedFat.toFixed(1)}g
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFood(mealFood.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Nova Refeição */}
      <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Refeição</DialogTitle>
            <DialogDescription>Adicione uma nova refeição à dieta</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mealName">Nome da Refeição</Label>
              <Input
                id="mealName"
                placeholder="Ex: Café da Manhã, Almoço..."
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealOrder">Ordem</Label>
              <Input
                id="mealOrder"
                type="number"
                placeholder="0, 1, 2..."
                value={mealOrder}
                onChange={(e) => setMealOrder(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMealDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMeal}>Criar Refeição</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Adicionar Alimento */}
      <Dialog open={foodDialogOpen} onOpenChange={setFoodDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Alimento</DialogTitle>
            <DialogDescription>Busque e adicione um alimento à refeição</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="foodSearch">Buscar Alimento</Label>
              <Input
                id="foodSearch"
                placeholder="Digite o nome do alimento..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto border rounded p-2 space-y-2">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedFoodId === food.id
                      ? 'bg-green-100 border-green-300 border-2'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedFoodId(food.id)}
                >
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-gray-600">
                    {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                    (por 100g)
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade (gramas)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Ex: 100"
                value={foodQuantity}
                onChange={(e) => setFoodQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFoodDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddFood}
              disabled={!selectedFoodId || !foodQuantity}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}