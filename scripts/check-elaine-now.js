const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  console.log('🔍 Verificando dados da Elaine AGORA...\n')
  
  // Buscar Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('*')
    .ilike('name', '%Elaine%')
    .single()
  
  if (!elaine) {
    console.log('❌ Elaine não encontrada')
    return
  }
  
  console.log(`✅ Elaine encontrada: ${elaine.name} (${elaine.id})\n`)
  
  // Buscar TODAS as vendas (sem filtro de data)
  const { data: allSales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })
  
  console.log(`📊 Total de vendas no banco: ${allSales?.length || 0}\n`)
  
  // Verificar vendas da Elaine por diferentes métodos
  console.log('🔍 Verificando vendas da Elaine:')
  
  // 1. Por sold_by (ID)
  const bySoldBy = allSales?.filter(s => s.sold_by === elaine.id)
  console.log(`   1. Por sold_by (${elaine.id}): ${bySoldBy?.length || 0} vendas`)
  if (bySoldBy && bySoldBy.length > 0) {
    bySoldBy.forEach((s, i) => {
      console.log(`      ${i + 1}. R$ ${s.amount} - Status: ${s.stage_name} - sold_by_name: ${s.sold_by_name}`)
    })
  }
  
  // 2. Por sold_by_name contendo "elaine"
  const bySoldByName = allSales?.filter(s => 
    s.sold_by_name && s.sold_by_name.toLowerCase().includes('elaine')
  )
  console.log(`   2. Por sold_by_name contendo "elaine": ${bySoldByName?.length || 0} vendas`)
  if (bySoldByName && bySoldByName.length > 0) {
    bySoldByName.forEach((s, i) => {
      console.log(`      ${i + 1}. R$ ${s.amount} - sold_by: ${s.sold_by} - sold_by_name: ${s.sold_by_name}`)
    })
  }
  
  // 3. Por email
  const byEmail = allSales?.filter(s => 
    s.sold_by_name && s.sold_by_name.toLowerCase().includes(elaine.email?.toLowerCase() || '')
  )
  console.log(`   3. Por email (${elaine.email}): ${byEmail?.length || 0} vendas`)
  
  // 4. Por leads atribuídos
  const { data: leads } = await supabase
    .from('leads')
    .select('id')
    .or(`assigned_to.eq.${elaine.id},owner_user_id.eq.${elaine.id}`)
  
  if (leads && leads.length > 0) {
    const leadIds = leads.map(l => l.id)
    const { data: salesFromLeads } = await supabase
      .from('sales')
      .select('*')
      .in('lead_id', leadIds)
    
    console.log(`   4. Por leads atribuídos (${leads.length} leads): ${salesFromLeads?.length || 0} vendas`)
    if (salesFromLeads && salesFromLeads.length > 0) {
      salesFromLeads.forEach((s, i) => {
        console.log(`      ${i + 1}. R$ ${s.amount} - Status: ${s.stage_name} - lead_id: ${s.lead_id}`)
      })
    }
  }
  
  // Verificar todas as vendas e seus sold_by_name
  console.log('\n📋 Todas as vendas e seus sold_by_name:')
  const uniqueSellers = {}
  allSales?.forEach(sale => {
    const seller = sale.sold_by_name || 'Sem vendedor'
    if (!uniqueSellers[seller]) {
      uniqueSellers[seller] = { count: 0, total: 0 }
    }
    uniqueSellers[seller].count++
    uniqueSellers[seller].total += parseFloat(sale.amount || 0)
  })
  
  Object.entries(uniqueSellers).forEach(([seller, data]) => {
    console.log(`   ${seller}: ${data.count} vendas = R$ ${data.total.toFixed(2)}`)
  })
}

check()
