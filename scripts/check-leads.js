const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Verificar se há tabela de leads
  const tables = ['leads', 'lead', 'opportunities', 'opportunity']
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (!error && data !== null) {
      console.log(`✅ Tabela "${table}" encontrada!`)
      if (data.length > 0) {
        console.log(`   Estrutura:`, Object.keys(data[0]))
      }
    }
  }
  
  // Verificar todas as colunas da tabela sales
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    .limit(1)
  
  if (sales && sales.length > 0) {
    console.log('\n📊 Colunas disponíveis na tabela sales:')
    console.log(Object.keys(sales[0]).join(', '))
  }
}

check()
