# 📱 Resolver Erro 404 no Mobile

## ❌ Problema: Funciona no PC mas dá 404 no celular

## ✅ Soluções

### 1. Limpar Cache do Navegador Mobile

**Android (Chrome):**
1. Abra o Chrome
2. Toque nos 3 pontos (menu)
3. Vá em **Configurações** > **Privacidade e segurança**
4. Toque em **Limpar dados de navegamento**
5. Marque **Imagens e arquivos em cache**
6. Toque em **Limpar dados**

**iOS (Safari):**
1. Abra **Configurações** do iPhone
2. Vá em **Safari**
3. Toque em **Limpar histórico e dados do site**
4. Confirme

### 2. Verificar a URL Correta

1. **No PC, copie a URL exata que funciona:**
   - Exemplo: `https://bi-wf-xxx.vercel.app`
   - Ou: `https://wf-kovr.vercel.app`

2. **No celular, digite a URL manualmente:**
   - Não use favoritos antigos
   - Não use links salvos
   - Digite a URL completa no navegador

### 3. Testar em Modo Anônimo/Privado

1. Abra o navegador em **modo anônimo/privado**
2. Digite a URL do dashboard
3. Se funcionar, é problema de cache

### 4. Verificar se é HTTPS

- Certifique-se de que a URL começa com `https://`
- Não use `http://` (sem o 's')

### 5. Tentar Outro Navegador

**Android:**
- Tente Chrome, Firefox ou Edge

**iOS:**
- Tente Safari, Chrome ou Firefox

### 6. Verificar Conectividade

1. Verifique se está conectado à internet
2. Tente com Wi-Fi e depois com dados móveis
3. Verifique se não há bloqueio de firewall

### 7. Verificar no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto
3. Vá em **Settings** > **Domains**
4. Verifique qual é a URL de produção
5. Use essa URL exata no celular

### 8. Forçar Atualização

**Android (Chrome):**
- Toque e segure o botão de atualizar
- Selecione **"Recarregar sem cache"**

**iOS (Safari):**
- Toque e segure o botão de atualizar
- Selecione **"Recarregar sem cache"**

### 9. Verificar Logs do Vercel

1. No Vercel Dashboard
2. Vá em **Deployments**
3. Clique no último deployment
4. Veja os logs
5. Verifique se há erros específicos de mobile

### 10. Testar URL Direta

Tente acessar diretamente:
- `https://[sua-url].vercel.app/`
- `https://[sua-url].vercel.app/api/dashboard`

## 🔍 Diagnóstico

### Se funciona no PC mas não no mobile:

1. **É cache do navegador mobile** → Limpe o cache
2. **É URL diferente** → Use a URL exata do Vercel
3. **É problema de rede** → Teste com Wi-Fi e dados
4. **É bloqueio** → Verifique firewall/proxy

### Se não funciona em nenhum lugar:

1. Verifique se o deployment está ativo no Vercel
2. Verifique se as variáveis de ambiente estão configuradas
3. Verifique os logs do build no Vercel

## 📝 Checklist

- [ ] Limpei o cache do navegador mobile
- [ ] Usei a URL exata do Vercel
- [ ] Testei em modo anônimo
- [ ] Testei em outro navegador
- [ ] Verifiquei se é HTTPS
- [ ] Testei com Wi-Fi e dados móveis
- [ ] Verifiquei os logs do Vercel

## 🆘 Ainda não funciona?

1. **Me envie:**
   - A URL exata que você está usando
   - Screenshot do erro
   - Qual navegador está usando no mobile
   - Se funciona em modo anônimo

2. **Verifique no Vercel:**
   - Se o deployment está ativo
   - Se há erros nos logs
   - Qual é a URL de produção correta

