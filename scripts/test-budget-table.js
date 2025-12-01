// Script para testar diferentes formas de acessar a tabela de orçamentos
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTable() {
  console.log('🔍 Testando acesso à tabela de orçamentos...\n')
  
  // Lista de possíveis nomes
  const tableNames = [
    'budget_activities',
    'budgetactivities',
    'budget_activity',
    'budgetactivity',
    'activities',
    'activity'
  ]
  
  for (const tableName of tableNames) {
    console.log(`\n📋 Testando: "${tableName}"`)
    
    try {
      // Tentar SELECT simples
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(10)
      
      if (error) {
        console.log(`   ❌ Erro: ${error.message}`)
        if (error.code === 'PGRST116') {
          console.log(`   💡 Tabela não existe`)
        } else if (error.code === 'PGRST301') {
          console.log(`   💡 Problema de permissão/RLS`)
        }
      } else {
        console.log(`   ✅ Acessível!`)
        console.log(`   📊 Total de registros: ${count || data?.length || 0}`)
        
        if (data && data.length > 0) {
          console.log(`   📋 Campos: ${Object.keys(data[0]).join(', ')}`)
          console.log(`   📝 Primeiro registro:`)
          console.log(JSON.stringify(data[0], null, 2))
        }
      }
    } catch (e) {
      console.log(`   ❌ Exceção: ${e.message}`)
    }
  }
  
  console.log('\n💡 Se nenhuma tabela funcionou, verifique:')
  console.log('   1. O nome exato da tabela no Supabase')
  console.log('   2. As políticas RLS (Row Level Security)')
  console.log('   3. Se a tabela está no schema público')
}

testTable()


