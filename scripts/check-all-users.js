const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, role, active')
    .eq('active', true)
  
  console.log('👥 Todos os usuários ativos no Supabase:')
  users?.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || user.email} (${user.role})`)
  })
  console.log(`\nTotal: ${users?.length || 0} usuários ativos`)
}

check()
