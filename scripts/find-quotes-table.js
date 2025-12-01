// Script para encontrar a tabela de orçamentos
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function findQuotesTable() {
  console.log('🔍 Procurando tabela de orçamentos...\n')
  
  const possibleNames = [
    'budgets', 'budget', 
    'orcamentos', 'orcamento', 
    'quotes', 'quote',
    'estimates', 'estimate',
    'proposals', 'proposal'
  ]
  
  for (const tableName of possibleNames) {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (!error && data !== null) {
      console.log(`✅ Tabela encontrada: "${tableName}"`)
      console.log(`   Total de registros: ${count || data.length}`)
      
      if (data.length > 0) {
        console.log(`   Estrutura:`, Object.keys(data[0]))
        console.log(`   Primeiro registro:`, data[0])
      }
      console.log('')
    }
  }
  
  // Verificar também na tabela sales se há orçamentos em aberto
  console.log('🔍 Verificando orçamentos em aberto na tabela sales...\n')
  const { data: openSales, count: openCount } = await supabase
    .from('sales')
    .select('*', { count: 'exact' })
    .is('sold_at', null)
    .limit(5)
  
  if (openSales && openSales.length > 0) {
    console.log(`✅ Encontrados ${openCount || openSales.length} registros em sales sem sold_at`)
    console.log(`   Estrutura:`, Object.keys(openSales[0]))
    console.log(`   Primeiro registro:`, openSales[0])
  }
}

findQuotesTable()


