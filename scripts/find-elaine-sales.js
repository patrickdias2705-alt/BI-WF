const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Buscar todas as vendas
  const { data: allSales } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false })
  
  console.log('🔍 Analisando todas as vendas para encontrar padrões...\n')
  
  // Verificar todos os sold_by_name únicos
  const uniqueNames = [...new Set(allSales?.map(s => s.sold_by_name).filter(Boolean) || [])]
  console.log('📋 sold_by_name únicos encontrados:')
  uniqueNames.forEach(name => console.log(`   - "${name}"`))
  
  // Verificar todos os sold_by IDs únicos
  const uniqueIds = [...new Set(allSales?.map(s => s.sold_by).filter(Boolean) || [])]
  console.log(`\n📋 sold_by IDs únicos: ${uniqueIds.length}`)
  uniqueIds.forEach(id => console.log(`   - ${id}`))
  
  // Verificar se há vendas com email da Elaine
  console.log('\n🔍 Buscando por email da Elaine (elaineportaporta@gmail.com):')
  const elaineEmailSales = allSales?.filter(s => 
    s.sold_by_name?.toLowerCase().includes('elaineportaporta') ||
    s.sold_by_name?.toLowerCase().includes('elaine')
  )
  console.log(`Encontradas: ${elaineEmailSales?.length || 0}`)
  
  // Verificar estrutura completa de algumas vendas
  console.log('\n📊 Exemplo de estrutura de venda:')
  if (allSales && allSales.length > 0) {
    console.log(JSON.stringify(allSales[0], null, 2))
  }
}

check()
