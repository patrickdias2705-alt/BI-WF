#!/bin/bash
# Script para preparar o projeto para GitHub

echo "🚀 Preparando projeto para GitHub..."

# Verificar se git está inicializado
if [ ! -d .git ]; then
    echo "📦 Inicializando Git..."
    git init
fi

# Adicionar todos os arquivos
echo "➕ Adicionando arquivos..."
git add .

# Status
echo ""
echo "📊 Status do Git:"
git status --short

echo ""
echo "✅ Pronto para commit!"
echo ""
echo "Próximos passos:"
echo "1. git commit -m 'Initial commit - Dashboard BI'"
echo "2. Crie o repositório no GitHub"
echo "3. git remote add origin https://github.com/SEU-USUARIO/bi-dashboard.git"
echo "4. git push -u origin main"
