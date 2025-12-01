const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  console.log('🔍 Verificando dados da Elaine...\n')
  
  // Buscar usuário Elaine
  const { data: elaine } = await supabase
    .from('users')
    .select('id, name, email')
    .ilike('name', '%Elaine%')
    .single()
  
  if (elaine) {
    console.log('✅ Elaine encontrada:')
    console.log('   ID:', elaine.id)
    console.log('   Nome:', elaine.name)
    console.log('   Email:', elaine.email)
    
    // Buscar vendas da Elaine
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: sales } = await supabase
      .from('sales')
      .select('*')
      .eq('sold_by', elaine.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
    
    console.log(`\n💰 Vendas da Elaine (últimos 30 dias): ${sales?.length || 0}`)
    
    if (sales && sales.length > 0) {
      console.log('\n📊 Detalhes das vendas:')
      sales.forEach((sale, i) => {
        console.log(`\n${i + 1}. Venda ID: ${sale.id}`)
        console.log(`   Valor: R$ ${sale.amount}`)
        console.log(`   Status: ${sale.stage_name}`)
        console.log(`   sold_at: ${sale.sold_at}`)
        console.log(`   created_at: ${sale.created_at}`)
        console.log(`   sold_by: ${sale.sold_by}`)
        console.log(`   sold_by_name: ${sale.sold_by_name}`)
      })
      
      const total = sales.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0)
      console.log(`\n💵 Total vendido: R$ ${total.toFixed(2)}`)
    } else {
      // Verificar todas as vendas para ver se há alguma com sold_by_name contendo Elaine
      const { data: allSales } = await supabase
        .from('sales')
        .select('*')
        .ilike('sold_by_name', '%elaine%')
        .gte('created_at', thirtyDaysAgo.toISOString())
      
      console.log(`\n🔍 Vendas com sold_by_name contendo "elaine": ${allSales?.length || 0}`)
      if (allSales && allSales.length > 0) {
        allSales.forEach((sale, i) => {
          console.log(`\n${i + 1}. sold_by_name: "${sale.sold_by_name}"`)
          console.log(`   sold_by: ${sale.sold_by}`)
          console.log(`   Valor: R$ ${sale.amount}`)
        })
      }
    }
  } else {
    console.log('❌ Elaine não encontrada na tabela users')
  }
}

check()
