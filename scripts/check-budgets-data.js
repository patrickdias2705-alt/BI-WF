// Script para verificar dados da tabela budgets e como estão relacionados
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBudgetsData() {
  console.log('🔍 Verificando dados da tabela budgets...\n')
  
  try {
    // Buscar todos os budgets
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (budgetsError) {
      console.error('❌ Erro ao buscar budgets:', budgetsError)
      return
    }
    
    console.log(`📊 Total de budgets encontrados: ${budgets?.length || 0}\n`)
    
    if (!budgets || budgets.length === 0) {
      console.log('⚠️  Tabela budgets está vazia')
      console.log('💡 Adicione orçamentos pelo CRM para aparecer no BI\n')
      return
    }
    
    // Mostrar estrutura do primeiro registro
    console.log('📋 Estrutura da tabela (primeiro registro):')
    if (budgets[0]) {
      Object.keys(budgets[0]).forEach(key => {
        console.log(`   ${key}: ${budgets[0][key]}`)
      })
    }
    
    console.log('\n📝 Todos os registros:')
    budgets.forEach((budget, index) => {
      console.log(`\n   Budget ${index + 1}:`)
      Object.entries(budget).forEach(([key, value]) => {
        console.log(`     ${key}: ${value}`)
      })
    })
    
    // Verificar relacionamento com vendedores
    console.log('\n👥 Verificando relacionamento com vendedores...\n')
    
    // Buscar os 3 vendedores
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('active', true)
      .or('name.ilike.%Elaine%,name.ilike.%Julia%,name.ilike.%Maria Vitória%')
    
    console.log('Vendedores encontrados:')
    users?.forEach(user => {
      console.log(`   - ${user.name} (ID: ${user.id})`)
    })
    
    console.log('\n🔗 Relacionamento budgets -> vendedores:')
    budgets.forEach((budget, index) => {
      const sellerId = budget.user_id || budget.seller_id || budget.owner_id || budget.assigned_to || budget.owner_user_id
      const sellerName = budget.seller_name || budget.user_name || budget.owner_name
      
      console.log(`\n   Budget ${index + 1}:`)
      console.log(`     ID do vendedor no budget: ${sellerId || 'NÃO ENCONTRADO'}`)
      console.log(`     Nome do vendedor no budget: ${sellerName || 'NÃO ENCONTRADO'}`)
      
      if (sellerId) {
        const matchedUser = users?.find(u => u.id === sellerId)
        if (matchedUser) {
          console.log(`     ✅ Relacionado com: ${matchedUser.name}`)
        } else {
          console.log(`     ❌ ID não corresponde a nenhum vendedor`)
        }
      } else if (sellerName) {
        const matchedUser = users?.find(u => 
          u.name.toLowerCase().includes(sellerName.toLowerCase()) ||
          sellerName.toLowerCase().includes(u.name.toLowerCase())
        )
        if (matchedUser) {
          console.log(`     ✅ Nome corresponde a: ${matchedUser.name}`)
        } else {
          console.log(`     ❌ Nome não corresponde a nenhum vendedor`)
        }
      } else {
        console.log(`     ❌ Sem informação de vendedor`)
      }
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

checkBudgetsData()


