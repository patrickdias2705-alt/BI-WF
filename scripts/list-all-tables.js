// Script para listar todas as tabelas disponíveis
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function listAllTables() {
  console.log('🔍 Listando todas as tabelas disponíveis...\n')
  
  // Lista de possíveis nomes de tabelas comuns em CRM
  const possibleTables = [
    'users', 'user',
    'sales', 'sale', 'deals', 'deal',
    'leads', 'lead',
    'budgets', 'budget',
    'budget_activities', 'budgetactivities', 'budget_activity',
    'activities', 'activity',
    'contacts', 'contact',
    'opportunities', 'opportunity',
    'quotes', 'quote',
    'estimates', 'estimate',
    'proposals', 'proposal',
    'orders', 'order',
    'invoices', 'invoice'
  ]
  
  const found = []
  
  for (const tableName of possibleTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(0)
      
      if (!error) {
        found.push({ name: tableName, count: count || 0 })
        console.log(`✅ ${tableName} (${count || 0} registros)`)
      }
    } catch (e) {
      // Ignorar erros
    }
  }
  
  console.log(`\n📊 Total de tabelas encontradas: ${found.length}`)
  
  // Verificar especificamente tabelas com "budget" ou "activity"
  console.log('\n🔍 Tabelas relacionadas a budget/activity:')
  found.filter(t => 
    t.name.toLowerCase().includes('budget') || 
    t.name.toLowerCase().includes('activity') ||
    t.name.toLowerCase().includes('activ')
  ).forEach(t => {
    console.log(`   - ${t.name} (${t.count} registros)`)
  })
}

listAllTables()


