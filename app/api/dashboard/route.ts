import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Forçar rota dinâmica (não estática) e desabilitar cache completamente
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET() {
  try {
    // Verificar se Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Usar service role key no servidor (mais seguro) ou anon key como fallback
    const supabaseKey = supabaseServiceKey || supabaseAnonKey

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { 
          error: 'Supabase não configurado',
          message: 'Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local'
        },
        { status: 500 }
      )
    }

    // Criar cliente Supabase (usando service role key no servidor para acesso completo)
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Data de 60 dias atrás (aumentado para incluir mais vendas)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60)
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

    // Data de hoje (início do dia)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Buscar apenas os 3 agentes específicos: Elaine, Julia e Maria Vitória
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role, active')
      .eq('active', true)
      .or('name.ilike.%Elaine%,name.ilike.%Julia%,name.ilike.%Maria Vitória%')
      .order('name')

    if (usersError) {
      console.error('Erro ao buscar users:', usersError)
      throw usersError
    }

    // Buscar vendas fechadas dos últimos 60 dias
    const { data: closedSales, error: closedSalesError } = await supabase
      .from('sales')
      .select('id, amount, stage_name, sold_at, sold_by, sold_by_name, lead_id, created_at')
      .not('sold_at', 'is', null)
      .gte('created_at', thirtyDaysAgoISO)
      .order('created_at', { ascending: false })

    if (closedSalesError) {
      console.error('Erro ao buscar vendas fechadas:', closedSalesError)
      throw closedSalesError
    }

    // Buscar orçamentos da tabela budget_documents
    let budgetsData: any[] = []
    let budgetsFromTable = false
    
    try {
      // Buscar apenas orçamentos com status "aberto" ou null (em aberto)
      const { data: budgetDocs, error: budgetDocsError } = await supabase
        .from('budget_documents')
        .select('*')
        .or('status.eq.aberto,status.is.null')
        .order('created_at', { ascending: false })
      
      if (budgetDocsError) {
        console.log('⚠️ Erro ao buscar budget_documents:', budgetDocsError.message)
      } else if (budgetDocs && budgetDocs.length > 0) {
        budgetsData = budgetDocs
        budgetsFromTable = true
        console.log(`✅ Encontrados ${budgetDocs.length} orçamentos em aberto na tabela budget_documents`)
      } else {
        console.log('ℹ️ Tabela budget_documents está vazia ou sem orçamentos em aberto, usando fallback da tabela sales')
      }
    } catch (error: any) {
      console.log('⚠️ Erro ao buscar orçamentos:', error?.message)
    }

    // Buscar TODOS os orçamentos em aberto da tabela sales (fallback se budgets estiver vazia)
    let openQuotesSales: any[] = []
    if (!budgetsFromTable) {
      const { data: salesQuotes, error: openQuotesError } = await supabase
        .from('sales')
        .select('id, amount, stage_name, sold_at, sold_by, sold_by_name, lead_id, created_at')
        .is('sold_at', null)
        .order('created_at', { ascending: false })

      if (openQuotesError) {
        console.error('Erro ao buscar orçamentos em aberto:', openQuotesError)
        // Não lançar erro, apenas logar
      } else {
        openQuotesSales = salesQuotes || []
      }
    }

    // Combinar vendas fechadas
    const allSales = [...(closedSales || [])]

    // Buscar leads atribuídos a cada vendedor para relacionar vendas
    const leadsBySeller = new Map<string, string[]>()
    for (const user of allUsers || []) {
      const { data: userLeads } = await supabase
        .from('leads')
        .select('id')
        .or(`assigned_to.eq.${user.id},owner_user_id.eq.${user.id}`)
      
      if (userLeads && userLeads.length > 0) {
        leadsBySeller.set(user.id, userLeads.map((l: any) => l.id))
      }
    }

    // Processar dados
    const sellersMap = new Map<string, {
      id: string
      name: string
      salesCount: number
      salesTotal: number
      openQuotesCount: number
      openQuotesValue: number
    }>()
    const totals = {
      totalSalesValue: 0,
      totalSalesCount: 0,
      totalOpenQuotes: 0,
      totalOpenQuotesValue: 0,
    }

    const openQuotes: any[] = []
    const todaySalesMap = new Map<string, {
      sellerId: string
      sellerName: string
      salesCount: number
      salesTotal: number
    }>()

    // Inicializar todos os vendedores
    allUsers?.forEach((user: any) => {
      // Usar ID como string (UUID)
      const sellerId = user.id
      sellersMap.set(sellerId, {
        id: sellerId,
        name: user.name || user.email,
        salesCount: 0,
        salesTotal: 0,
        openQuotesCount: 0,
        openQuotesValue: 0,
      })
      todaySalesMap.set(sellerId, {
        sellerId,
        sellerName: user.name || user.email,
        salesCount: 0,
        salesTotal: 0,
      })
    })

    // Criar mapa auxiliar para buscar vendedor por email ou nome
    const sellerByEmail = new Map<string, string>()
    allUsers?.forEach((user: any) => {
      if (user.email) {
        sellerByEmail.set(user.email.toLowerCase(), user.id)
      }
      if (user.name) {
        sellerByEmail.set(user.name.toLowerCase(), user.id)
      }
    })

    // Processar orçamentos da tabela budget_documents primeiro
    if (budgetsFromTable && budgetsData.length > 0) {
      budgetsData.forEach((budget: any) => {
        // Identificar o vendedor do orçamento
        // Tentar diferentes campos possíveis: uploaded_by, user_id, seller_id, owner_id, assigned_to, owner_user_id
        let sellerId = budget.uploaded_by || 
                      budget.user_id || 
                      budget.seller_id || 
                      budget.owner_id || 
                      budget.assigned_to || 
                      budget.owner_user_id
        const budgetAmount = parseFloat(budget.amount || budget.value || budget.total || 0)
        const budgetDate = budget.created_at || budget.created_date || new Date().toISOString()

        // Se não encontrou pelo ID direto, tentar pelo nome/email
        if (!sellerId || !sellersMap.has(sellerId)) {
          const sellerName = budget.seller_name || budget.user_name || budget.owner_name || ''
          if (sellerName) {
            const normalizedName = sellerName.toLowerCase()
            for (const [key, userId] of Array.from(sellerByEmail.entries())) {
              if (normalizedName.includes(key) || key.includes(normalizedName.split('@')[0])) {
                sellerId = userId
                break
              }
            }
          }
        }

        // Se ainda não encontrou, tentar pelo lead_id (prioridade para budget_documents)
        if ((!sellerId || !sellersMap.has(sellerId)) && budget.lead_id) {
          for (const [userId, leadIds] of Array.from(leadsBySeller.entries())) {
            if (leadIds.includes(budget.lead_id)) {
              sellerId = userId
              break
            }
          }
        }

        // Se encontrou o vendedor, adicionar o orçamento
        if (sellerId && sellersMap.has(sellerId)) {
          const sellerData = sellersMap.get(sellerId)
          if (sellerData) {
            sellerData.openQuotesCount++
            sellerData.openQuotesValue += budgetAmount
            totals.totalOpenQuotes++
            totals.totalOpenQuotesValue += budgetAmount

            const correctSellerName = allUsers?.find(u => u.id === sellerId)?.name || budget.seller_name || 'Sem vendedor'

            openQuotes.push({
              id: budget.id,
              sellerId: sellerId,
              sellerName: correctSellerName,
              value: budgetAmount,
              createdAt: budgetDate,
              source: 'budgets',
            })
          }
        }
      })
    }

    // Processar orçamentos da tabela sales (fallback se budgets estiver vazia)
    if (!budgetsFromTable && openQuotesSales.length > 0) {
      openQuotesSales.forEach((sale: any) => {
        let sellerId = sale.sold_by
        const sellerName = sale.sold_by_name || 'Sem vendedor'
        const saleAmount = parseFloat(sale.amount || 0)
        const saleDate = new Date(sale.created_at || sale.sold_at)

        // Se não encontrou pelo ID, tentar pelo nome/email
        if (!sellerId || !sellersMap.has(sellerId)) {
          const normalizedName = sellerName.toLowerCase()
          for (const [key, userId] of Array.from(sellerByEmail.entries())) {
            if (normalizedName.includes(key) || key.includes(normalizedName.split('@')[0])) {
              sellerId = userId
              break
            }
          }
        }

        // Se ainda não encontrou, tentar pelo lead_id
        if ((!sellerId || !sellersMap.has(sellerId)) && sale.lead_id) {
          for (const [userId, leadIds] of Array.from(leadsBySeller.entries())) {
            if (leadIds.includes(sale.lead_id)) {
              sellerId = userId
              break
            }
          }
        }

        // Verificar se é orçamento em aberto (não tem sold_at E não é status de vendido)
        const isOpenQuote = sale.sold_at === null && 
                            sale.stage_name !== 'Dinheiro no bolso' &&
                            sale.stage_name !== 'Dinheiro na mesa' &&
                            !sale.stage_name?.toLowerCase().includes('vendido') &&
                            !sale.stage_name?.toLowerCase().includes('fechado') &&
                            !sale.stage_name?.toLowerCase().includes('dinheiro no bolso')

        if (isOpenQuote && sellerId && sellersMap.has(sellerId)) {
          const sellerData = sellersMap.get(sellerId)
          if (sellerData) {
            sellerData.openQuotesCount++
            sellerData.openQuotesValue += saleAmount
            totals.totalOpenQuotes++
            totals.totalOpenQuotesValue += saleAmount

            const correctSellerName = allUsers?.find(u => u.id === sellerId)?.name || sellerName

            openQuotes.push({
              id: sale.id,
              sellerId: sellerId,
              sellerName: correctSellerName,
              value: saleAmount,
              createdAt: sale.created_at,
              stageName: sale.stage_name,
              source: 'sales',
            })
          }
        }
      })
    }

    // Processar vendas fechadas
    allSales?.forEach((sale: any) => {
      let sellerId = sale.sold_by
      const sellerName = sale.sold_by_name || 'Sem vendedor'
      const saleAmount = parseFloat(sale.amount || 0)
      const saleDate = new Date(sale.created_at || sale.sold_at)

      // Se não encontrou pelo ID, tentar pelo nome/email
      if (!sellerId || !sellersMap.has(sellerId)) {
        const normalizedName = sellerName.toLowerCase()
        // Tentar encontrar pelo email ou nome
        for (const [key, userId] of Array.from(sellerByEmail.entries())) {
          if (normalizedName.includes(key) || key.includes(normalizedName.split('@')[0])) {
            sellerId = userId
            break
          }
        }
      }

      // Se ainda não encontrou, tentar pelo lead_id (vendas relacionadas aos leads do vendedor)
      if ((!sellerId || !sellersMap.has(sellerId)) && sale.lead_id) {
        for (const [userId, leadIds] of Array.from(leadsBySeller.entries())) {
          if (leadIds.includes(sale.lead_id)) {
            sellerId = userId
            break
          }
        }
      }

      // Verificar se é venda fechada (tem sold_at ou stage_name indica venda)
      const isSold = sale.sold_at !== null || 
                     sale.stage_name === 'Dinheiro no bolso' ||
                     sale.stage_name === 'Dinheiro na mesa' ||
                     sale.stage_name?.toLowerCase().includes('vendido') ||
                     sale.stage_name?.toLowerCase().includes('fechado') ||
                     sale.stage_name?.toLowerCase().includes('dinheiro no bolso')

      // Processar apenas vendas fechadas (orçamentos já foram processados acima)
      if (isSold && sellerId && sellersMap.has(sellerId)) {
        const sellerData = sellersMap.get(sellerId)
        if (sellerData) {
          sellerData.salesCount++
          sellerData.salesTotal += saleAmount
          totals.totalSalesValue += saleAmount
          totals.totalSalesCount++

          // Vendas do dia atual
          if (saleDate >= today && saleDate < tomorrow) {
            const todayData = todaySalesMap.get(sellerId)
            if (todayData) {
              todayData.salesCount++
              todayData.salesTotal += saleAmount
            }
          }
        }
      }
    })

    // Mostrar todos os vendedores, mesmo sem vendas (para aparecer no dashboard)
    const sellers = Array.from(sellersMap.values())
      .sort((a, b) => b.salesTotal - a.salesTotal)

    const todaySales = Array.from(todaySalesMap.values())
      .filter(s => s.salesCount > 0) // Apenas vendedores com vendas hoje
      .sort((a, b) => b.salesTotal - a.salesTotal)

    // Ordenar orçamentos por data
    openQuotes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({
      totals,
      sellers,
      openQuotes,
      todaySales,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar dados do dashboard',
        message: error?.message || 'Erro desconhecido',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
