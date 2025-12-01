# Dashboard BI - Vendas em Tempo Real

Dashboard de Business Intelligence para exibir o desempenho de vendedores em tempo real, otimizado para exibição em TV.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (com tema white e glassmorphism)
- **Supabase** (PostgreSQL)
- **Recharts** (gráficos dinâmicos)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase com projeto criado
- Dados já cadastrados no Supabase

## ⚙️ Instalação Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd "BI WF"
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

### 🔑 Como obter as chaves do Supabase:

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse o dashboard em:

```
http://localhost:3001
```

**Nota:** O dashboard roda na porta 3001 para não conflitar com outras aplicações.

## 📊 Estrutura do Banco de Dados no Supabase

O dashboard espera as seguintes tabelas no seu projeto Supabase:

### Tabela `users`
Tabela de usuários/vendedores com os campos:
- `id` (UUID)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `active` (BOOLEAN)

### Tabela `sales`
Tabela de vendas com os campos:
- `id` (UUID)
- `amount` (DECIMAL)
- `sold_by` (UUID - referência a users.id)
- `sold_by_name` (VARCHAR)
- `sold_at` (TIMESTAMP - null para orçamentos em aberto)
- `stage_name` (VARCHAR - status da venda)
- `created_at` (TIMESTAMP)
- `lead_id` (UUID - referência ao lead)

### Tabela `budget_documents`
Tabela de orçamentos/documentos com os campos:
- `id` (UUID)
- `lead_id` (UUID)
- `amount` (DECIMAL)
- `uploaded_by` (UUID - referência a users.id)
- `status` (VARCHAR - "aberto" para orçamentos em aberto)
- `created_at` (TIMESTAMP)

### Tabela `leads`
Tabela de leads com os campos:
- `id` (UUID)
- `assigned_to` (UUID - referência a users.id)
- `created_at` (TIMESTAMP)

### 🔐 Configuração de RLS (Row Level Security)

No Supabase, você precisa configurar as políticas de segurança para permitir leitura:

1. Vá em **Authentication** > **Policies**
2. Para cada tabela (`users`, `sales`, `budget_documents`, `leads`): permitir SELECT público

Ou execute no SQL Editor do Supabase:

```sql
-- Permitir leitura pública das tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Permitir leitura pública de sales"
  ON sales FOR SELECT
  USING (true);

CREATE POLICY "Permitir leitura pública de budget_documents"
  ON budget_documents FOR SELECT
  USING (true);

CREATE POLICY "Permitir leitura pública de leads"
  ON leads FOR SELECT
  USING (true);
```

## 🎨 Funcionalidades

- ✅ **Atualização automática** a cada 15 segundos
- ✅ **Cards de métricas principais:**
  - Total de Vendas
  - Vendas Fechadas
  - Orçamentos em Aberto
  - Ticket Médio
  - Taxa de Conversão
  - Média de Vendas por Vendedor
- ✅ **Ranking de vendedores** com métricas detalhadas
- ✅ **Gráficos dinâmicos:**
  - Gráfico de pizza (distribuição de vendas)
  - Gráfico de barras (vendas vs meta)
- ✅ **Orçamentos em aberto** por vendedor
- ✅ **Vendas do dia** por vendedor
- ✅ **Layout white premium** com glassmorphism otimizado para TV
- ✅ **Tema responsivo** com cores royal blue e green money

## 📝 API

### GET `/api/dashboard`

Retorna os dados do dashboard em tempo real:

```json
{
  "totals": {
    "totalSalesValue": 0,
    "totalSalesCount": 0,
    "totalOpenQuotes": 0,
    "totalOpenQuotesValue": 0
  },
  "sellers": [
    {
      "id": "uuid",
      "name": "Nome do Vendedor",
      "salesCount": 0,
      "salesTotal": 0,
      "openQuotesCount": 0,
      "openQuotesValue": 0
    }
  ],
  "openQuotes": [...],
  "todaySales": [...]
}
```

## 🚀 Deploy no Vercel

### Passo 1: Preparar o Repositório

1. Certifique-se de que todos os arquivos estão commitados:
```bash
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### Passo 2: Conectar ao Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **Add New Project**
4. Importe o repositório do GitHub

### Passo 3: Configurar Variáveis de Ambiente

No Vercel, vá em **Settings** > **Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

### Passo 4: Deploy

1. Clique em **Deploy**
2. Aguarde o build completar
3. Acesse a URL fornecida pelo Vercel

### Configurações Recomendadas no Vercel

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `.next` (automático)
- **Install Command:** `npm install` (automático)

## 📁 Estrutura do Projeto

```
BI WF/
├── app/
│   ├── api/
│   │   └── dashboard/
│   │       └── route.ts          # API endpoint do dashboard
│   ├── globals.css                # Estilos globais e glassmorphism
│   ├── layout.tsx                 # Layout raiz
│   └── page.tsx                   # Página principal do dashboard
├── lib/
│   └── supabase.ts                # Cliente Supabase
├── scripts/                       # Scripts de teste/debug
├── .env.local                     # Variáveis de ambiente (não commitado)
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento (porta 3001)
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção (porta 3001)
- `npm run lint` - Executa o linter

## 🐛 Troubleshooting

### Erro: "Supabase não configurado"
- Verifique se o arquivo `.env.local` existe e contém todas as variáveis necessárias
- No Vercel, verifique se as variáveis de ambiente estão configuradas

### Dados não aparecem
- Verifique se as tabelas existem no Supabase
- Verifique se as políticas RLS estão configuradas corretamente
- Verifique se os nomes dos vendedores correspondem: "Elaine", "Julia", "Maria Vitória"

### Build falha no Vercel
- Verifique se todas as dependências estão no `package.json`
- Verifique se as variáveis de ambiente estão configuradas
- Verifique os logs de build no Vercel

## 📄 Licença

Este projeto é privado e proprietário.
