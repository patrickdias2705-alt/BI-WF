const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  console.log('🔍 Verificando TODAS as vendas...\n')
  
  // Buscar todas as vendas (sem filtro de data primeiro)
  const { data: allSales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  
  console.log(`📊 Total de vendas encontradas: ${allSales?.length || 0}\n`)
  
  // Agrupar por sold_by_name
  const bySeller = {}
  allSales?.forEach(sale => {
    const seller = sale.sold_by_name || 'Sem vendedor'
    if (!bySeller[seller]) {
      bySeller[seller] = { count: 0, total: 0, sales: [] }
    }
    bySeller[seller].count++
    bySeller[seller].total += parseFloat(sale.amount || 0)
    bySeller[seller].sales.push(sale)
  })
  
  console.log('👥 Vendas por vendedor:')
  Object.entries(bySeller).forEach(([seller, data]) => {
    console.log(`\n${seller}:`)
    console.log(`  Total: ${data.count} vendas`)
    console.log(`  Valor: R$ ${data.total.toFixed(2)}`)
    console.log(`  sold_by IDs únicos: ${[...new Set(data.sales.map(s => s.sold_by))].join(', ')}`)
  })
  
  // Verificar vendas da Elaine especificamente
  console.log('\n\n🔍 Buscando vendas da Elaine (qualquer variação):')
  const elaineSales = allSales?.filter(s => 
    (s.sold_by_name && s.sold_by_name.toLowerCase().includes('elaine')) ||
    (s.sold_by && s.sold_by === 'a25d3e7e-410f-451f-861f-a1597fe7f585')
  )
  
  console.log(`Encontradas: ${elaineSales?.length || 0} vendas`)
  if (elaineSales && elaineSales.length > 0) {
    elaineSales.forEach((sale, i) => {
      console.log(`\n${i + 1}.`)
      console.log(`   Valor: R$ ${sale.amount}`)
      console.log(`   Status: ${sale.stage_name}`)
      console.log(`   sold_at: ${sale.sold_at}`)
      console.log(`   sold_by: ${sale.sold_by}`)
      console.log(`   sold_by_name: ${sale.sold_by_name}`)
      console.log(`   created_at: ${sale.created_at}`)
    })
  }
}

check()
