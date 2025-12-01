const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  console.log('📊 Verificando estrutura das tabelas...\n')
  
  // Verificar users (vendedores)
  console.log('👥 Tabela USERS (vendedores):')
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(3)
  
  if (!usersError && users) {
    console.log('   Estrutura:', Object.keys(users[0] || {}))
    console.log('   Exemplo:', users[0])
    console.log('   Total de registros (primeiros 3):', users.length)
  }
  
  console.log('\n💰 Tabela SALES (vendas):')
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('*')
    .limit(3)
  
  if (!salesError && sales) {
    console.log('   Estrutura:', Object.keys(sales[0] || {}))
    console.log('   Exemplo:', sales[0])
    console.log('   Total de registros (primeiros 3):', sales.length)
    
    // Verificar valores únicos de stage_name para entender os status
    const { data: stages } = await supabase
      .from('sales')
      .select('stage_name')
    
    const uniqueStages = [...new Set(stages?.map(s => s.stage_name) || [])]
    console.log('   Status possíveis (stage_name):', uniqueStages)
  }
  
  // Verificar vendas dos últimos 30 dias
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: recentSales } = await supabase
    .from('sales')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .limit(5)
  
  console.log('\n📅 Vendas dos últimos 30 dias (exemplos):', recentSales?.length || 0)
}

check()
