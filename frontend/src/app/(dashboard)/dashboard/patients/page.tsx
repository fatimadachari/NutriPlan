'use client';

import { useEffect, useState } from 'react';
import { patientsApi } from '@/lib/api/patients';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await patientsApi.delete(id);
        loadPatients();
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
      }
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">Gerencie seus pacientes</p>
        </div>
        <Button>
          <Plus className="mr-2" size={20} />
          Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum paciente cadastrado ainda.</p>
              <Button className="mt-4">
                <Plus className="mr-2" size={20} />
                Cadastrar Primeiro Paciente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Altura</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell>{patient.weight} kg</TableCell>
                    <TableCell>{patient.height} cm</TableCell>
                    <TableCell>{patient.goal}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(patient.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}