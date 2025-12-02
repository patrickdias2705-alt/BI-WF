# 🔧 Configurar Variáveis de Ambiente no Vercel

## ⚠️ Erro Atual
O dashboard está mostrando: "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"

Isso significa que as variáveis de ambiente não foram configuradas no Vercel.

## ✅ Solução Rápida

### Passo 1: Acessar Configurações do Projeto
1. Acesse: https://vercel.com
2. Faça login
3. Clique no projeto **BI-WF** (ou o nome que você deu)
4. Vá em **Settings** (Configurações)
5. Clique em **Environment Variables** (Variáveis de Ambiente)

### Passo 2: Adicionar as 3 Variáveis

Adicione cada uma das variáveis abaixo:

#### 1️⃣ NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://xqeqaagnnkilihlfjbrm.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** (sua chave anon do Supabase)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 3️⃣ SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** (sua service role key do Supabase - a que você usou no .env.local)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Passo 3: Redeploy
Após adicionar as variáveis:
1. Vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **Redeploy**
4. Ou simplesmente faça um novo commit/push que o Vercel fará deploy automático

## 🔑 Onde Encontrar as Chaves do Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

## ⚠️ Importante

- As variáveis devem estar marcadas para **Production**, **Preview** e **Development**
- Após adicionar, é necessário fazer **Redeploy** para aplicar
- A `SUPABASE_SERVICE_ROLE_KEY` é sensível - mantenha secreta!

## ✅ Verificação

Após configurar e fazer redeploy, acesse:
`https://bi-wf-kovr.vercel.app` (ou sua URL do Vercel)

O dashboard deve carregar os dados corretamente!


