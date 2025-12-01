const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Buscar TODAS as vendas (sem filtro de data)
  const { data: allSales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })
  
  console.log(`📊 Total de vendas no banco: ${allSales?.length || 0}\n`)
  
  // Agrupar por stage_name
  const byStatus = {}
  allSales?.forEach(sale => {
    const status = sale.stage_name || 'sem_status'
    if (!byStatus[status]) {
      byStatus[status] = []
    }
    byStatus[status].push(sale)
  })
  
  console.log('📋 Vendas por status:')
  Object.entries(byStatus).forEach(([status, sales]) => {
    const total = sales.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0)
    console.log(`\n${status}: ${sales.length} vendas = R$ ${total.toFixed(2)}`)
    if (sales.length <= 3) {
      sales.forEach((s, i) => {
        console.log(`  ${i + 1}. R$ ${s.amount} - sold_by: ${s.sold_by} - sold_by_name: ${s.sold_by_name}`)
      })
    }
  })
  
  // Verificar vendas com lead_id relacionado à Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('id')
    .ilike('name', '%Elaine%')
    .single()
  
  if (elaine) {
    const { data: elaineLeads } = await supabase
      .from('leads')
      .select('id')
      .or(`assigned_to.eq.${elaine.id},owner_user_id.eq.${elaine.id}`)
    
    if (elaineLeads && elaineLeads.length > 0) {
      const leadIds = elaineLeads.map(l => l.id)
      const { data: salesFromLeads } = await supabase
        .from('sales')
        .select('*')
        .in('lead_id', leadIds)
      
      console.log(`\n\n💰 Vendas relacionadas aos leads da Elaine: ${salesFromLeads?.length || 0}`)
      if (salesFromLeads && salesFromLeads.length > 0) {
        salesFromLeads.forEach((sale, i) => {
          console.log(`\n${i + 1}.`)
          console.log(`   Valor: R$ ${sale.amount}`)
          console.log(`   Status: ${sale.stage_name}`)
          console.log(`   sold_at: ${sale.sold_at}`)
          console.log(`   sold_by: ${sale.sold_by}`)
          console.log(`   sold_by_name: ${sale.sold_by_name}`)
        })
      }
    }
  }
}

check()
