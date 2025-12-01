// Script para verificar a tabela budget_activities
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBudgetActivities() {
  console.log('🔍 Verificando tabela budget_activities...\n')
  
  const possibleNames = [
    'budget_activities',
    'budgetactivities', 
    'budget_activity',
    'budgetactivity',
    'budget_activies', // Como o usuário escreveu
    'budgetactivies'
  ]
  
  for (const tableName of possibleNames) {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (!error && data !== null) {
      console.log(`✅ Tabela encontrada: "${tableName}"`)
      console.log(`   Total de registros: ${count || data.length}\n`)
      
      if (data.length > 0) {
        console.log('📋 Estrutura da tabela:')
        console.log('   Campos:', Object.keys(data[0]).join(', '))
        console.log('\n📝 Primeiros registros:')
        data.forEach((item, index) => {
          console.log(`\n   Registro ${index + 1}:`)
          Object.entries(item).forEach(([key, value]) => {
            console.log(`     ${key}: ${value}`)
          })
        })
      } else {
        console.log('   (tabela vazia)')
      }
      return tableName
    } else {
      if (error?.code !== 'PGRST116') {
        console.log(`❌ "${tableName}": ${error?.message}`)
      }
    }
  }
  
  return null
}

checkBudgetActivities().then(tableName => {
  if (tableName) {
    console.log(`\n✅ Tabela correta: "${tableName}"`)
  } else {
    console.log('\n❌ Nenhuma tabela encontrada')
  }
})


