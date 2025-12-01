// Script para testar conexão com Supabase e verificar estrutura das tabelas
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...\n')

  try {
    // Listar todas as tabelas
    console.log('📊 Verificando tabelas disponíveis...\n')
    
    // Tentar buscar vendedores
    console.log('1. Testando tabela "sellers"...')
    const { data: sellers, error: sellersError } = await supabase
      .from('sellers')
      .select('*')
      .limit(5)
    
    if (sellersError) {
      console.error('   ❌ Erro:', sellersError.message)
      console.log('   💡 Verifique se a tabela existe e tem permissões')
    } else {
      console.log('   ✅ Tabela "sellers" encontrada!')
      console.log('   📋 Estrutura:', sellers.length > 0 ? Object.keys(sellers[0]) : 'Tabela vazia')
      console.log('   📊 Registros:', sellers.length)
      if (sellers.length > 0) {
        console.log('   Exemplo:', sellers[0])
      }
    }

    console.log('\n2. Testando tabela "deals"...')
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .limit(5)
    
    if (dealsError) {
      console.error('   ❌ Erro:', dealsError.message)
      console.log('   💡 Verifique se a tabela existe e tem permissões')
    } else {
      console.log('   ✅ Tabela "deals" encontrada!')
      console.log('   📋 Estrutura:', deals.length > 0 ? Object.keys(deals[0]) : 'Tabela vazia')
      console.log('   📊 Registros:', deals.length)
      if (deals.length > 0) {
        console.log('   Exemplo:', deals[0])
      }
    }

    console.log('\n✅ Teste concluído!')
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error.message)
  }
}

testConnection()



