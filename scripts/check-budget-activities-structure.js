// Script para verificar estrutura da tabela budget_activities
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStructure() {
  console.log('🔍 Verificando estrutura da tabela budget_activities...\n')
  
  // Tentar inserir um registro temporário para ver a estrutura (vai falhar, mas mostra os campos)
  // Ou tentar buscar com SELECT * limit 0
  try {
    // Tentar fazer um SELECT que retorna estrutura mesmo sem dados
    const { data, error } = await supabase
      .from('budget_activities')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Erro:', error.message)
      console.log('Código:', error.code)
      console.log('Detalhes:', error.details)
      console.log('Hint:', error.hint)
    } else {
      if (data && data.length > 0) {
        console.log('✅ Estrutura encontrada:')
        console.log('Campos:', Object.keys(data[0]))
        console.log('\nExemplo:')
        console.log(JSON.stringify(data[0], null, 2))
      } else {
        console.log('ℹ️ Tabela existe mas está vazia')
        console.log('💡 Quando você adicionar dados, eles aparecerão aqui')
      }
    }
  } catch (e) {
    console.error('Erro:', e.message)
  }
}

checkStructure()


