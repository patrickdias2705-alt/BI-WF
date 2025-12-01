const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Buscar Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('id, name')
    .ilike('name', '%Elaine%')
    .single()
  
  // Buscar TODAS as vendas da Elaine (sem filtro de data)
  const { data: allSales } = await supabase
    .from('sales')
    .select('*')
    .eq('sold_by', elaine.id)
    .order('created_at', { ascending: false })
  
  console.log(`📊 Total de vendas da Elaine: ${allSales?.length || 0}\n`)
  
  if (allSales && allSales.length > 0) {
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    console.log(`📅 Data atual: ${now.toLocaleDateString('pt-BR')}`)
    console.log(`📅 30 dias atrás: ${thirtyDaysAgo.toLocaleDateString('pt-BR')}\n`)
    
    let inside30Days = 0
    let outside30Days = 0
    
    allSales.forEach((sale, i) => {
      const saleDate = new Date(sale.created_at)
      const isInside = saleDate >= thirtyDaysAgo
      
      if (isInside) {
        inside30Days++
      } else {
        outside30Days++
      }
      
      console.log(`${i + 1}. R$ ${sale.amount} - ${sale.stage_name}`)
      console.log(`   Data: ${saleDate.toLocaleDateString('pt-BR')} ${saleDate.toLocaleTimeString('pt-BR')}`)
      console.log(`   ${isInside ? '✅' : '❌'} ${isInside ? 'Dentro' : 'Fora'} dos últimos 30 dias`)
      console.log('')
    })
    
    console.log(`\n📊 Resumo:`)
    console.log(`   ✅ Dentro dos últimos 30 dias: ${inside30Days}`)
    console.log(`   ❌ Fora dos últimos 30 dias: ${outside30Days}`)
  }
}

check()
