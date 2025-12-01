# 🚀 Guia de Deploy - Dashboard BI

Este guia explica como fazer o deploy do Dashboard BI no Vercel.

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Vercel (gratuita)
- ✅ Projeto configurado no Supabase
- ✅ Código funcionando localmente

## 🔧 Passo a Passo

### 1. Preparar o Repositório GitHub

1. **Criar repositório no GitHub:**
   - Acesse [github.com](https://github.com)
   - Clique em **New repository**
   - Nome: `bi-dashboard` (ou outro de sua preferência)
   - Público ou Privado (sua escolha)
   - **NÃO** marque "Initialize with README" (já temos um)

2. **Conectar e fazer push:**
```bash
# Se ainda não inicializou o git
git init
git add .
git commit -m "Initial commit - Dashboard BI"

# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/bi-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Conectar ao Vercel

1. **Acesse o Vercel:**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

2. **Importar Projeto:**
   - Clique em **Add New Project**
   - Selecione o repositório `bi-dashboard`
   - Clique em **Import**

### 3. Configurar o Projeto no Vercel

1. **Configurações do Projeto:**
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `.next` (automático)
   - **Install Command:** `npm install` (automático)

2. **Variáveis de Ambiente:**
   
   Clique em **Environment Variables** e adicione:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```
   Valor: `https://seu-projeto.supabase.co`

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   Valor: `sua-chave-anon-key-aqui`

   ```
   SUPABASE_SERVICE_ROLE_KEY
   ```
   Valor: `sua-service-role-key-aqui` ⚠️ **MANTENHA SECRETO**

   **Importante:** 
   - Marque todas as variáveis para **Production**, **Preview** e **Development**
   - A variável `SUPABASE_SERVICE_ROLE_KEY` é sensível - não compartilhe!

3. **Deploy:**
   - Clique em **Deploy**
   - Aguarde o build completar (2-3 minutos)

### 4. Verificar o Deploy

1. **Após o build:**
   - O Vercel fornecerá uma URL como: `https://bi-dashboard.vercel.app`
   - Clique na URL para acessar

2. **Testar:**
   - Verifique se o dashboard carrega
   - Verifique se os dados aparecem corretamente
   - Verifique se a atualização automática funciona

### 5. Configurações Adicionais (Opcional)

#### Domínio Customizado

1. No Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio personalizado
3. Siga as instruções de DNS

#### Variáveis de Ambiente por Ambiente

Você pode ter diferentes valores para:
- **Production** (produção)
- **Preview** (branches de preview)
- **Development** (desenvolvimento local)

## 🔄 Atualizações Futuras

Para atualizar o dashboard:

1. **Faça as alterações localmente:**
```bash
# Teste localmente
npm run dev
```

2. **Commit e push:**
```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

3. **Deploy automático:**
   - O Vercel detecta o push automaticamente
   - Faz o deploy automaticamente
   - Você recebe uma notificação quando concluir

## 🐛 Troubleshooting

### Build Falha

**Erro:** "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente e commit o `package-lock.json`

**Erro:** "Environment variable not found"
- Verifique se todas as variáveis estão configuradas no Vercel
- Verifique se estão marcadas para o ambiente correto

**Erro:** "Build timeout"
- O build pode demorar na primeira vez
- Tente novamente ou verifique os logs

### Dashboard Não Carrega

**Erro:** "Supabase não configurado"
- Verifique as variáveis de ambiente no Vercel
- Certifique-se de que `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão configuradas

**Erro:** "Dados não aparecem"
- Verifique se as políticas RLS no Supabase permitem leitura
- Verifique os logs do Vercel (Functions > Logs)

### Performance

- O Vercel oferece cache automático
- A API está configurada para não usar cache (`no-store`)
- Atualizações aparecem em até 15 segundos

## 📊 Monitoramento

No Vercel, você pode:
- Ver logs em tempo real
- Monitorar performance
- Ver analytics de uso
- Configurar alertas

## 🔐 Segurança

⚠️ **Importante:**
- Nunca commite o arquivo `.env.local`
- Nunca compartilhe a `SUPABASE_SERVICE_ROLE_KEY`
- Use variáveis de ambiente no Vercel
- Configure RLS no Supabase adequadamente

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Repositório conectado ao Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build completado com sucesso
- [ ] Dashboard acessível na URL do Vercel
- [ ] Dados aparecendo corretamente
- [ ] Atualização automática funcionando

## 🎉 Pronto!

Seu dashboard está no ar! Compartilhe a URL com sua equipe.

