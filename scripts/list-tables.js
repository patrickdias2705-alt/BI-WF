// Script para listar todas as tabelas disponíveis no Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function listTables() {
  console.log('🔍 Buscando tabelas no Supabase...\n')
  
  try {
    // Tentar buscar informações do schema usando uma query SQL direta
    // Nota: Isso pode não funcionar dependendo das permissões
    // Vamos tentar algumas tabelas comuns de CRM
    
    const possibleTables = [
      'sellers', 'vendedores', 'vendedor', 'seller',
      'deals', 'negocios', 'negocio', 'deal', 'vendas', 'venda',
      'users', 'usuarios', 'user', 'usuario',
      'contacts', 'contatos', 'contact', 'contato',
      'opportunities', 'oportunidades', 'opportunity', 'oportunidade'
    ]
    
    console.log('📋 Testando nomes de tabelas comuns...\n')
    
    for (const tableName of possibleTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (!error && data !== null) {
        console.log(`✅ Tabela encontrada: "${tableName}"`)
        if (data.length > 0) {
          console.log(`   Estrutura:`, Object.keys(data[0]))
          console.log(`   Exemplo:`, data[0])
        } else {
          console.log(`   (tabela vazia)`)
        }
        console.log('')
      }
    }
    
    // Tentar buscar todas as tabelas usando RPC (se disponível)
    console.log('📊 Tentando listar todas as tabelas via SQL...\n')
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables')
    
    if (!tablesError && tables) {
      console.log('Tabelas encontradas:', tables)
    } else {
      console.log('💡 Não foi possível listar tabelas automaticamente.')
      console.log('💡 Por favor, me informe os nomes exatos das suas tabelas no Supabase.')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

listTables()



