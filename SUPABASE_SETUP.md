# 🚀 Guia de Configuração do Supabase

## Passo a Passo para Conectar seu Dashboard ao Supabase

### 1. Obter as Chaves do Supabase

1. Acesse: https://app.supabase.com
2. Faça login e selecione seu projeto
3. Vá em **Settings** (⚙️) > **API**
4. Você verá:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: uma chave longa começando com `eyJ...`

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

**⚠️ IMPORTANTE:** 
- Substitua pelos valores reais do seu projeto
- Não commite este arquivo no Git (já está no .gitignore)

### 3. Verificar Estrutura das Tabelas

Certifique-se de que suas tabelas no Supabase têm esta estrutura:

#### Tabela `sellers`
- `id` (integer, primary key)
- `name` (text/varchar)
- `created_at` (timestamp, opcional)

#### Tabela `deals`
- `id` (integer, primary key)
- `seller_id` (integer, foreign key para sellers.id)
- `value` (decimal/numeric)
- `status` (text/varchar) - valores: `'sold'` ou `'quote_open'`
- `created_at` (timestamp)

### 4. Configurar Permissões (RLS)

No Supabase, vá em **Authentication** > **Policies** e crie políticas para permitir leitura:

**Para tabela `sellers`:**
- Policy name: "Permitir leitura pública"
- Operation: SELECT
- Target roles: anon, authenticated
- USING expression: `true`

**Para tabela `deals`:**
- Policy name: "Permitir leitura pública"
- Operation: SELECT
- Target roles: anon, authenticated
- USING expression: `true`

### 5. Testar a Conexão

1. Reinicie o servidor: `npm run dev`
2. Acesse: http://localhost:3000
3. O dashboard deve carregar os dados reais do Supabase

### 6. Verificar se está Funcionando

- Se aparecer dados mockados: as chaves não estão configuradas corretamente
- Se aparecer erro: verifique as políticas RLS e a estrutura das tabelas
- Se aparecer dados reais: ✅ Tudo funcionando!

## 🔍 Troubleshooting

**Erro: "Invalid API key"**
- Verifique se copiou a chave completa (anon key)
- Certifique-se de que o arquivo `.env.local` está na raiz do projeto

**Erro: "permission denied"**
- Configure as políticas RLS no Supabase
- Verifique se as tabelas existem

**Dados não aparecem**
- Verifique se há dados nas tabelas `sellers` e `deals`
- Verifique se os `status` estão como `'sold'` ou `'quote_open'`
- Verifique se `created_at` está dentro dos últimos 30 dias

## 📞 Precisa de Ajuda?

Quando você fornecer as chaves, eu posso ajudar a:
- Verificar se a conexão está funcionando
- Ajustar queries se necessário
- Configurar políticas RLS
- Testar com seus dados reais
