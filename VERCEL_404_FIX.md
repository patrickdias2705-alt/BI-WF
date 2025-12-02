# 🔧 Resolver Erro 404 no Vercel

## ❌ Erro: `DEPLOYMENT_NOT_FOUND`

Este erro significa que o deployment não foi encontrado no Vercel. Isso pode acontecer por alguns motivos:

## ✅ Soluções

### 1. Verificar se o Projeto Está Conectado ao Vercel

1. **Acesse o Vercel Dashboard:**
   - Vá para: https://vercel.com/dashboard
   - Faça login na sua conta

2. **Verificar se o projeto existe:**
   - Procure por `BI-WF` ou `bi-dashboard` na lista de projetos
   - Se não encontrar, o projeto não está conectado

### 2. Conectar o Projeto ao Vercel (Se não estiver conectado)

1. **No Vercel Dashboard:**
   - Clique em **"Add New Project"** ou **"Import Project"**
   - Selecione o repositório `patrickdias2705-alt/BI-WF`
   - Clique em **"Import"**

2. **Configurar o Projeto:**
   - **Framework Preset:** Next.js (deve detectar automaticamente)
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `.next` (automático)

3. **Adicionar Variáveis de Ambiente:**
   - Antes de fazer deploy, adicione as variáveis:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Marque para **Production**, **Preview** e **Development**

4. **Fazer Deploy:**
   - Clique em **"Deploy"**
   - Aguarde o build completar (2-3 minutos)

### 3. Se o Projeto Já Está Conectado

1. **Verificar Deployments:**
   - No projeto, vá em **"Deployments"**
   - Verifique se há algum deployment ativo
   - Se não houver, faça um novo deploy

2. **Fazer Novo Deploy:**
   - Opção 1: Fazer um commit vazio para triggerar deploy:
     ```bash
     git commit --allow-empty -m "Trigger Vercel deploy"
     git push origin main
     ```
   - Opção 2: No Vercel, vá em **"Deployments"** > **"Redeploy"** (se houver um deployment anterior)

### 4. Verificar a URL Correta

1. **No Vercel Dashboard:**
   - Vá no projeto
   - Clique em **"Settings"** > **"Domains"**
   - Verifique qual é a URL correta do projeto
   - Pode ser algo como: `bi-wf.vercel.app` ou `bi-wf-xxx.vercel.app`

2. **Se a URL estiver diferente:**
   - Use a URL que aparece no Vercel
   - Ou configure um domínio customizado

### 5. Verificar Permissões do Repositório

1. **No GitHub:**
   - Vá para: https://github.com/patrickdias2705-alt/BI-WF
   - Verifique se o repositório é público ou se o Vercel tem acesso

2. **Se for privado:**
   - O Vercel precisa ter permissão para acessar
   - Vá em **Settings** > **Integrations** no Vercel
   - Verifique se o GitHub está conectado

## 🔄 Passo a Passo Rápido

### Se o projeto NÃO está no Vercel:

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione: `patrickdias2705-alt/BI-WF`
4. Configure as variáveis de ambiente
5. Clique em **"Deploy"**

### Se o projeto JÁ está no Vercel:

1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto `BI-WF`
3. Vá em **"Deployments"**
4. Clique nos **3 pontinhos** (⋯) do último deployment
5. Clique em **"Redeploy"**
6. Ou faça um novo commit:
   ```bash
   git commit --allow-empty -m "Redeploy Vercel"
   git push origin main
   ```

## 📝 Checklist

- [ ] Projeto existe no Vercel Dashboard?
- [ ] Repositório está conectado?
- [ ] Variáveis de ambiente estão configuradas?
- [ ] Build está passando?
- [ ] URL está correta?

## 🆘 Ainda com Problemas?

Se ainda estiver com erro 404:

1. **Deletar e recriar o projeto:**
   - No Vercel, delete o projeto
   - Crie um novo projeto importando o mesmo repositório

2. **Verificar logs:**
   - No Vercel, vá em **"Deployments"** > **"View Function Logs"**
   - Veja se há erros no build

3. **Contatar suporte:**
   - Vercel tem suporte via chat
   - Ou verifique a documentação: https://vercel.com/docs

