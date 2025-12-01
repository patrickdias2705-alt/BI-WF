// Script para verificar a estrutura da tabela budgets
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBudgets() {
  console.log('🔍 Verificando tabela budgets...\n')
  
  try {
    // Tentar diferentes nomes possíveis
    const possibleNames = ['budgets', 'budget', 'orcamentos', 'orcamento', 'quotes', 'quote']
    
    for (const tableName of possibleNames) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(10)
      
      if (!error && data !== null) {
        console.log(`✅ Tabela encontrada: "${tableName}"\n`)
        
        // Contar total de registros
        const { count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        console.log(`📊 Total de registros na tabela: ${count || 0}\n`)
        
        if (data.length > 0) {
          console.log('📋 Estrutura da tabela:')
          console.log('   Campos:', Object.keys(data[0]).join(', '))
          console.log('\n📝 Exemplos de registros:')
          data.forEach((item, index) => {
            console.log(`\n   Registro ${index + 1}:`)
            Object.entries(item).forEach(([key, value]) => {
              console.log(`     ${key}: ${value}`)
            })
          })
          
          // Verificar se há relacionamento com users/vendedores
          console.log('\n🔗 Verificando relacionamentos...')
          const firstItem = data[0]
          if (firstItem.user_id || firstItem.seller_id || firstItem.owner_id || firstItem.assigned_to || firstItem.owner_user_id) {
            console.log('   ✅ Parece ter relacionamento com vendedor')
            const relationField = firstItem.user_id ? 'user_id' : 
                                 firstItem.seller_id ? 'seller_id' : 
                                 firstItem.owner_id ? 'owner_id' : 
                                 firstItem.assigned_to ? 'assigned_to' : 'owner_user_id'
            console.log(`   Campo de relacionamento: ${relationField}`)
          }
          if (firstItem.amount || firstItem.value || firstItem.total) {
            console.log('   ✅ Parece ter campo de valor')
            const valueField = firstItem.amount ? 'amount' : firstItem.value ? 'value' : 'total'
            console.log(`   Campo de valor: ${valueField}`)
          }
        } else {
          console.log('   (tabela vazia - mas estrutura existe)')
          // Tentar ver a estrutura mesmo sem dados
          const { data: structureData, error: structureError } = await supabase
            .from(tableName)
            .select('*')
            .limit(0)
          
          if (!structureError) {
            console.log('\n💡 Tabela existe mas não tem dados ainda.')
            console.log('💡 Você pode adicionar dados através do CRM.')
          }
        }
        break
      } else {
        if (error?.code !== 'PGRST116') { // PGRST116 = tabela não existe
          console.log(`⚠️  Erro ao acessar "${tableName}":`, error?.message)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

checkBudgets()

