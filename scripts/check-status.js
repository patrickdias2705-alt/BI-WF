const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Verificar todos os status únicos
  const { data: allSales } = await supabase
    .from('sales')
    .select('stage_name, sold_at, amount')
  
  const statusCount = {}
  allSales?.forEach(sale => {
    const status = sale.stage_name || 'sem_status'
    statusCount[status] = (statusCount[status] || 0) + 1
  })
  
  console.log('📊 Status encontrados nas vendas:')
  Object.entries(statusCount).forEach(([status, count]) => {
    console.log(`   "${status}": ${count} registros`)
  })
  
  // Verificar se há orçamentos (sales sem sold_at)
  const { data: withoutSoldAt } = await supabase
    .from('sales')
    .select('*')
    .is('sold_at', null)
    .limit(5)
  
  console.log(`\n📋 Vendas sem sold_at (possíveis orçamentos): ${withoutSoldAt?.length || 0}`)
  if (withoutSoldAt && withoutSoldAt.length > 0) {
    console.log('   Exemplo:', withoutSoldAt[0])
  }
}

check()
