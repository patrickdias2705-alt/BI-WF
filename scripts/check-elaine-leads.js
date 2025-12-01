const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Buscar ID da Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('name', '%Elaine%')
    .single()
  
  if (!elaine) {
    console.log('❌ Elaine não encontrada')
    return
  }
  
  console.log(`✅ Elaine: ${elaine.name} (${elaine.id})\n`)
  
  // Buscar leads atribuídos à Elaine
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .or(`assigned_to.eq.${elaine.id},owner_user_id.eq.${elaine.id}`)
    .limit(10)
  
  console.log(`📋 Leads atribuídos à Elaine: ${leads?.length || 0}`)
  if (leads && leads.length > 0) {
    leads.forEach((lead, i) => {
      console.log(`\n${i + 1}. Lead: ${lead.name || lead.email}`)
      console.log(`   Status: ${lead.status}`)
      console.log(`   assigned_to: ${lead.assigned_to}`)
      console.log(`   owner_user_id: ${lead.owner_user_id}`)
    })
    
    // Buscar vendas relacionadas a esses leads
    const leadIds = leads.map(l => l.id)
    const { data: sales } = await supabase
      .from('sales')
      .select('*')
      .in('lead_id', leadIds)
    
    console.log(`\n💰 Vendas relacionadas aos leads da Elaine: ${sales?.length || 0}`)
    if (sales && sales.length > 0) {
      const total = sales.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0)
      console.log(`   Total: R$ ${total.toFixed(2)}`)
      sales.forEach((sale, i) => {
        console.log(`\n   ${i + 1}. Venda: R$ ${sale.amount}`)
        console.log(`      Status: ${sale.stage_name}`)
        console.log(`      sold_by: ${sale.sold_by}`)
        console.log(`      sold_by_name: ${sale.sold_by_name}`)
      })
    }
  }
}

check()
