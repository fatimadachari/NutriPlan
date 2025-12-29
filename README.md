# 🥗 NutriPlan

SaaS para nutricionistas que automatiza o cálculo de dietas e gera PDFs profissionais.

## 📋 Sobre o Projeto

O NutriPlan resolve a dor de calcular calorias e macronutrientes manualmente. Nutricionistas podem:
- Gerenciar pacientes
- Montar refeições com alimentos da Tabela TACO
- Visualizar cálculos de Kcal/Macros em tempo real
- Gerar PDFs profissionais para entregar aos pacientes

## 🚀 Stack Tecnológica

### Backend
- .NET 8 (Web API)
- Clean Architecture (Domain, Application, Infrastructure, API)
- Entity Framework Core + SQL Server
- QuestPDF (geração de documentos)
- XUnit (testes unitários)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI (componentes)
- Axios (consumo de API)

## 📁 Estrutura do Projeto
```
NutriPlan/
├── backend/
│   ├── NutriPlan.Domain/          # Entidades e regras de negócio
│   ├── NutriPlan.Application/     # Casos de uso e interfaces
│   ├── NutriPlan.Infrastructure/  # EF Core, repositórios
│   └── NutriPlan.API/             # Controllers e endpoints
└── frontend/                       # (em breve)
```

## 🛠️ Como Rodar

### Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run --project NutriPlan.API
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🗺️ Roadmap

- [x] Setup inicial com Clean Architecture
- [ ] Modelagem de Entidades (Domain)
- [ ] Configuração do EF Core + Seed da Tabela TACO
- [ ] CRUD de Pacientes e Busca de Alimentos
- [ ] Setup do Frontend (Next.js + Shadcn/UI)
- [ ] Telas de Listagem e Cadastro de Pacientes
- [ ] Lógica de montagem de dietas (Fullstack)
- [ ] Geração de PDF profissional
