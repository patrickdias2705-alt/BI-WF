const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()
  
  console.log(`📅 Verificando vendas dos últimos 30 dias (desde ${thirtyDaysAgo.toLocaleDateString('pt-BR')})...\n`)
  
  // Buscar Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('id, name')
    .ilike('name', '%Elaine%')
    .single()
  
  // Buscar vendas da Elaine dos últimos 30 dias
  const { data: recentSales } = await supabase
    .from('sales')
    .select('*')
    .eq('sold_by', elaine.id)
    .gte('created_at', thirtyDaysAgoISO)
    .order('created_at', { ascending: false })
  
  console.log(`✅ Vendas da Elaine nos últimos 30 dias: ${recentSales?.length || 0}\n`)
  
  if (recentSales && recentSales.length > 0) {
    let total = 0
    recentSales.forEach((sale, i) => {
      const date = new Date(sale.created_at)
      const isSold = sale.sold_at !== null || 
                     sale.stage_name === 'Dinheiro no bolso' ||
                     sale.stage_name === 'Dinheiro na mesa' ||
                     sale.stage_name?.toLowerCase().includes('vendido') ||
                     sale.stage_name?.toLowerCase().includes('fechado')
      
      total += parseFloat(sale.amount || 0)
      console.log(`${i + 1}. R$ ${sale.amount} - ${sale.stage_name} - ${date.toLocaleDateString('pt-BR')} - Vendido: ${isSold ? 'SIM' : 'NÃO'}`)
    })
    console.log(`\n💰 Total: R$ ${total.toFixed(2)}`)
  }
  
  // Verificar o que a API está retornando
  console.log('\n🔍 Testando o que a API retorna...')
  const response = await fetch('http://localhost:3001/api/dashboard')
  const data = await response.json()
  
  const elaineData = data.sellers.find(s => s.name === 'Elaine')
  console.log(`\n📊 Elaine na API: ${elaineData ? `${elaineData.salesCount} vendas = R$ ${elaineData.salesTotal.toFixed(2)}` : 'NÃO ENCONTRADA'}`)
}

check()
