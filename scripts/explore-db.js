const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function explore() {
  // Testar mais nomes possíveis
  const tables = [
    'users', 'user', 'usuarios', 'usuario',
    'sellers', 'vendedores', 'vendedor', 'seller', 'salespeople',
    'deals', 'negocios', 'negocio', 'deal', 'vendas', 'venda', 'sales',
    'opportunities', 'oportunidades', 'opportunity', 'oportunidade',
    'quotes', 'orcamentos', 'quote', 'orcamento',
    'contacts', 'contatos', 'contact', 'contato',
    'customers', 'clientes', 'customer', 'cliente',
    'products', 'produtos', 'product', 'produto',
    'orders', 'pedidos', 'order', 'pedido',
    'transactions', 'transacoes', 'transaction', 'transacao'
  ]
  
  console.log('🔍 Explorando banco de dados...\n')
  
  const found = []
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (!error && data !== null) {
      found.push({ name: table, structure: data.length > 0 ? Object.keys(data[0]) : [] })
      console.log(`✅ ${table}`)
      if (data.length > 0) {
        console.log(`   Campos: ${Object.keys(data[0]).join(', ')}`)
      }
    }
  }
  
  console.log(`\n📊 Total de tabelas encontradas: ${found.length}`)
  console.log('\n📋 Tabelas:')
  found.forEach(t => console.log(`   - ${t.name}`))
}

explore()
