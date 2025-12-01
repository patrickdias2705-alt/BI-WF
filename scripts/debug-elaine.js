const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  console.log('🔍 DEBUG: Verificando por que a Elaine não aparece no BI\n')
  
  // Buscar Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('*')
    .ilike('name', '%Elaine%')
    .single()
  
  console.log('👤 Elaine:', JSON.stringify(elaine, null, 2))
  
  // Buscar TODAS as vendas
  const { data: allSales } = await supabase
    .from('sales')
    .select('*')
  
  console.log(`\n💰 Total de vendas: ${allSales?.length || 0}`)
  
  // Verificar se alguma venda tem relação com Elaine
  if (elaine) {
    console.log(`\n🔍 Verificando vendas relacionadas à Elaine (ID: ${elaine.id}):`)
    
    // Por sold_by
    const bySoldBy = allSales?.filter(s => s.sold_by === elaine.id)
    console.log(`   Por sold_by: ${bySoldBy?.length || 0}`)
    
    // Por sold_by_name
    const bySoldByName = allSales?.filter(s => 
      s.sold_by_name && s.sold_by_name.toLowerCase().includes('elaine')
    )
    console.log(`   Por sold_by_name contendo "elaine": ${bySoldByName?.length || 0}`)
    
    // Por email
    const byEmail = allSales?.filter(s => 
      s.sold_by_name && s.sold_by_name.toLowerCase().includes(elaine.email?.toLowerCase() || '')
    )
    console.log(`   Por email (${elaine.email}): ${byEmail?.length || 0}`)
    
    // Por leads
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
      
      console.log(`   Por leads atribuídos (${leads.length} leads): ${salesFromLeads?.length || 0}`)
    }
  }
}

check()
