'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface DashboardData {
  totals: {
    totalSalesValue: number
    totalSalesCount: number
    totalOpenQuotes: number
    totalOpenQuotesValue?: number
  }
  sellers: {
    id: string
    name: string
    salesCount: number
    salesTotal: number
    openQuotesCount: number
    openQuotesValue?: number
  }[]
  openQuotes: {
    id: string
    sellerId?: string
    sellerName: string
    value: number
    createdAt: string
  }[]
  todaySales: {
    sellerId: string
    sellerName: string
    salesCount: number
    salesTotal: number
  }[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [hideNumbers, setHideNumbers] = useState(false)

  // Log inicial
  useEffect(() => {
    console.log('🚀 Dashboard montado, iniciando busca de dados...')
  }, [])

  const fetchData = async () => {
    try {
      setError(null)
      console.log('🔄 Buscando dados do dashboard...')
      
      // Adicionar timeout de 10 segundos
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch('/api/dashboard?' + new Date().getTime(), {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || `Erro ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('✅ Dados recebidos:', result)
      
      if (!result || !result.totals || !result.sellers) {
        throw new Error('Dados inválidos recebidos da API')
      }
      
      setData(result)
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados:', error)
      if (error.name === 'AbortError') {
        setError('Timeout: A requisição demorou muito para responder. Verifique se o servidor está rodando.')
      } else {
        setError(error?.message || 'Erro ao carregar dados do dashboard')
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🔄 useEffect executado, chamando fetchData...')
    fetchData()
    const interval = setInterval(() => {
      console.log('⏰ Intervalo de 15s: atualizando dados...')
      fetchData()
    }, 15000) // 15 segundos (reduzido para atualização mais rápida)
    return () => {
      console.log('🧹 Limpando intervalo...')
      clearInterval(interval)
    }
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Função para ocultar números
  const formatCurrencyHidden = (value: number) => {
    if (hideNumbers) {
      return '••••••'
    }
    return formatCurrency(value)
  }

  const formatNumberHidden = (value: number) => {
    if (hideNumbers) {
      return '•••'
    }
    return value.toString()
  }

  const formatPercentHidden = (value: number) => {
    if (hideNumbers) {
      return '•••%'
    }
    return value.toFixed(1) + '%'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <div className="text-2xl font-semibold text-gray-700">Carregando dados...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white border-2 border-red-200 rounded-3xl p-8 shadow-2xl max-w-2xl animate-scale-in">
          <h2 className="text-3xl font-bold text-red-500 mb-4">⚠️ Erro ao Carregar Dados</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          {error.includes('DATABASE_URL') && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
              <p className="text-gray-600 text-sm mb-2 font-semibold">Para configurar:</p>
              <ol className="text-gray-500 text-sm list-decimal list-inside space-y-1">
                <li>Crie um arquivo <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> na raiz do projeto</li>
                <li>Adicione: <code className="bg-gray-200 px-2 py-1 rounded">DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco</code></li>
                <li>Reinicie o servidor (Ctrl+C e depois <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code>)</li>
              </ol>
            </div>
          )}
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              fetchData()
            }}
            className="mt-6 bg-royal-blue hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Nenhum dado disponível</div>
      </div>
    )
  }

  // Calcular porcentagem para ranking
  const maxSales = Math.max(...data.sellers.map(s => s.salesTotal), 1)
  
  // Meta geral fixa: R$ 500.000
  const salesGoal = 500000
  const goalProgress = (data.totals.totalSalesValue / salesGoal) * 100
  
  // Metas individuais fixas por vendedor
  const getIndividualGoal = (sellerName: string): number => {
    const name = sellerName.toLowerCase()
    if (name.includes('maria')) return 150000 // Maria: R$ 150.000
    if (name.includes('elaine')) return 100000 // Elaine: R$ 100.000
    if (name.includes('julia')) return 350000 // Julia: R$ 350.000
    return 0
  }
  
  // Calcular progresso individual de cada vendedor
  const sellersWithGoal = data.sellers.map(seller => {
    const individualGoal = getIndividualGoal(seller.name)
    const sellerProgress = individualGoal > 0 ? (seller.salesTotal / individualGoal) * 100 : 0
    const remaining = Math.max(0, individualGoal - seller.salesTotal)
    return {
      ...seller,
      individualGoal,
      individualProgress: sellerProgress,
      remaining,
      hasReachedGoal: seller.salesTotal >= individualGoal,
    }
  })
  
  // Métricas adicionais
  const averageTicket = data.totals.totalSalesCount > 0 
    ? data.totals.totalSalesValue / data.totals.totalSalesCount 
    : 0
  const totalQuotes = data.totals.totalSalesCount + data.totals.totalOpenQuotes
  const conversionRate = totalQuotes > 0 
    ? (data.totals.totalSalesCount / totalQuotes) * 100 
    : 0
  const averageSalesPerSeller = data.sellers.length > 0
    ? data.totals.totalSalesValue / data.sellers.length
    : 0
  
  // Preparar dados para o gráfico
  const chartColors = ['#4169E1', '#10b981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']
  const chartData = data.sellers.map((seller, index) => ({
    name: seller.name,
    value: seller.salesTotal,
    color: chartColors[index % chartColors.length]
  }))

  // Processar vendas do dia atual
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
  
  // Garantir que todos os vendedores apareçam, mesmo sem vendas hoje
  const todaySalesBySeller = data.sellers.map((seller) => {
    const todayData = data.todaySales.find(ts => ts.sellerId === seller.id)
    return {
      sellerId: seller.id,
      sellerName: seller.name,
      salesCount: todayData?.salesCount || 0,
      salesTotal: todayData?.salesTotal || 0,
      color: chartColors[data.sellers.findIndex(s => s.id === seller.id) % chartColors.length],
    }
  }).sort((a, b) => b.salesTotal - a.salesTotal) // Ordenar por vendas do dia

  // Calcular total das vendas do dia
  const totalTodaySales = todaySalesBySeller.reduce((sum, seller) => sum + seller.salesTotal, 0)

  return (
    <div className="min-h-screen md:h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 p-2 md:p-4 animate-fade-in relative overflow-x-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-royal-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-money rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="h-full max-w-[1920px] mx-auto relative z-10 flex flex-col">
        {/* Header */}
        <div className="mb-2 md:mb-2 animate-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-royal-blue drop-shadow-sm">
                Dashboard de Vendas
              </h1>
              <p className="text-gray-700 text-xs md:text-sm font-medium">
                Atualiza automaticamente a cada 30s
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={() => setHideNumbers(!hideNumbers)}
                className={`glass-header rounded-xl px-3 py-2 md:px-4 flex items-center justify-center gap-2 transition-all duration-300 text-xs md:text-sm ${
                  hideNumbers 
                    ? 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30' 
                    : 'hover:bg-white/30'
                }`}
              >
                <span className="text-base md:text-lg">{hideNumbers ? '👁️' : '🔒'}</span>
                <span className="font-semibold text-gray-800">
                  {hideNumbers ? 'Mostrar' : 'Ocultar'} Números
                </span>
              </button>
              <div className="glass-header rounded-xl px-3 py-2 md:px-4 text-center md:text-right">
                <div className="text-xs text-gray-600 mb-0.5 font-medium">Última atualização</div>
                <div className="text-sm md:text-base font-semibold text-gray-800">{formatTime(lastUpdate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Principal - Responsivo */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 overflow-y-auto md:overflow-hidden pb-4 md:pb-0">
          {/* Coluna 1: Cards de Totais */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2 md:gap-3">
            <div className="glass-card-premium rounded-xl md:rounded-2xl p-3 md:p-4 glass-card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-green-money flex items-center justify-center text-white text-base md:text-lg shadow-xl">
                  R$
                </div>
                <div className="text-right">
                  <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wide mb-0.5">Total Vendido</h3>
                  <p className="text-xl md:text-2xl font-bold text-green-money drop-shadow-sm">
                    {formatCurrencyHidden(data.totals.totalSalesValue)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-green-money rounded-full shadow-lg" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="glass-card-premium rounded-2xl p-4 glass-card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-royal-blue flex items-center justify-center text-white text-lg shadow-xl">
                  ✓
                </div>
                <div className="text-right">
                  <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wide mb-0.5">Vendas Fechadas</h3>
                  <p className="text-2xl font-bold text-royal-blue drop-shadow-sm">
                    {formatNumberHidden(data.totals.totalSalesCount)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-royal-blue rounded-full shadow-lg" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="glass-card-premium rounded-2xl p-4 glass-card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-money flex items-center justify-center text-white text-lg shadow-xl">
                  📋
                </div>
                <div className="text-right">
                  <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wide mb-0.5">Orçamentos em Aberto</h3>
                  <p className="text-2xl font-bold text-green-money drop-shadow-sm">
                    {formatNumberHidden(data.totals.totalOpenQuotes)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-green-money rounded-full shadow-lg" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Métricas Adicionais */}
            <div className="glass-card-premium rounded-2xl p-4 glass-card-hover animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-royal-blue flex items-center justify-center text-white text-lg shadow-xl">
                  💳
                </div>
                <div className="text-right">
                  <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wide mb-0.5">Ticket Médio</h3>
                  <p className="text-2xl font-bold text-royal-blue drop-shadow-sm">
                    {formatCurrencyHidden(averageTicket)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-royal-blue rounded-full shadow-lg" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="glass-card-premium rounded-2xl p-4 glass-card-hover animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-money flex items-center justify-center text-white text-lg shadow-xl">
                  📈
                </div>
                <div className="text-right">
                  <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wide mb-0.5">Taxa de Conversão</h3>
                  <p className="text-2xl font-bold text-green-money drop-shadow-sm">
                    {formatPercentHidden(conversionRate)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-green-money rounded-full shadow-lg" style={{ width: `${conversionRate}%` }}></div>
              </div>
            </div>

            <div className="glass-card-premium rounded-2xl p-4 glass-card-hover animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-royal-blue flex items-center justify-center text-white text-lg shadow-xl">
                  👤
                </div>
                <div className="text-right">
                  <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wide mb-0.5">Média por Vendedor</h3>
                  <p className="text-2xl font-bold text-royal-blue drop-shadow-sm">
                    {formatCurrencyHidden(averageSalesPerSeller)}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full bg-royal-blue rounded-full shadow-lg" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Card de Total de Leads - Preenche espaço restante */}
            <div className="glass-card-premium rounded-2xl p-4 glass-card-hover animate-slide-up flex-1 flex flex-col justify-center" style={{ animationDelay: '0.7s' }}>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-blue to-blue-600 flex items-center justify-center text-white text-3xl shadow-2xl mb-4">
                  🎯
                </div>
                <h3 className="text-gray-700 text-sm font-semibold uppercase tracking-wide mb-3 text-center">Total de Leads (Hoje)</h3>
                <p className="text-5xl font-bold text-royal-blue drop-shadow-sm mb-4">
                  0
                </p>
                <div className="w-full mt-4">
                  <div className="h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                    <div className="h-full bg-gradient-to-r from-royal-blue to-blue-500 rounded-full shadow-lg" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Meta vs Vendido + Estatísticas */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
            <div className="glass-card-premium rounded-xl md:rounded-2xl p-3 md:p-5 border-2 border-royal-blue/30 shadow-2xl flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-royal-blue to-blue-600 flex items-center justify-center text-white text-base md:text-xl shadow-xl flex-shrink-0">
                    🎯
                  </div>
                  <h2 className="text-base md:text-xl font-bold text-royal-blue drop-shadow-sm">
                    Meta de Vendas
                  </h2>
                </div>
                <div className="text-right bg-white/30 backdrop-blur-sm rounded-lg md:rounded-xl px-2 py-1.5 md:px-3 md:py-2 border border-white/40 flex-shrink-0">
                  <div className="text-xs text-gray-600 font-medium mb-0.5">Progresso</div>
                  <div className="text-base md:text-xl font-bold text-royal-blue drop-shadow-sm">{formatPercentHidden(goalProgress)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/30">
                  <div className="text-xs text-gray-700 font-medium mb-1 md:mb-1.5">Meta do Mês</div>
                  <div className="text-base md:text-xl font-bold text-royal-blue drop-shadow-sm leading-tight">
                    {formatCurrencyHidden(salesGoal)}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/30">
                  <div className="text-xs text-gray-700 font-medium mb-1 md:mb-1.5">Total Vendido</div>
                  <div className="text-base md:text-xl font-bold text-green-money drop-shadow-sm leading-tight">
                    {formatCurrencyHidden(data.totals.totalSalesValue)}
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso da meta */}
              <div className="relative mb-4">
                <div className="h-7 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-green-money to-green-500 rounded-full transition-all duration-2000 shadow-lg flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(goalProgress, 100)}%` }}
                  >
                    {goalProgress >= 10 && (
                      <span className="text-white text-xs font-bold drop-shadow-md">
                        {formatPercentHidden(goalProgress)}
                      </span>
                    )}
                  </div>
                </div>
                {goalProgress >= 100 && (
                  <div className="absolute top-0 right-0 mt-1 text-green-money font-bold text-sm animate-pulse">
                    🎉 Meta!
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs mt-auto">
                <span className="text-gray-600">
                  Faltam: <span className="font-bold text-royal-blue text-sm">{formatCurrencyHidden(Math.max(0, salesGoal - data.totals.totalSalesValue))}</span>
                </span>
                <span className="text-gray-600 font-medium">
                  {goalProgress < 100 ? 'Em andamento' : 'Superada!'}
                </span>
              </div>
            </div>

            {/* Card de Orçamentos em Aberto - Preenche espaço restante */}
            <div className="glass-card-premium rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-royal-blue drop-shadow-sm">
                  Orçamentos em Aberto
                </h2>
                <div className="w-8 h-8 rounded-lg bg-green-money flex items-center justify-center text-white text-sm shadow-xl">
                  📋
                </div>
              </div>
              
              {/* Total geral */}
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-green-money drop-shadow-sm mb-1">
                  {formatNumberHidden(data.totals.totalOpenQuotes)}
                </div>
                <div className="text-xs text-gray-600 font-medium mb-2">
                  {data.totals.totalOpenQuotes === 1 ? 'orçamento' : 'orçamentos'}
                </div>
                {data.totals.totalOpenQuotesValue && data.totals.totalOpenQuotesValue > 0 && (
                  <div className="text-lg font-bold text-royal-blue">
                    {formatCurrencyHidden(data.totals.totalOpenQuotesValue)}
                  </div>
                )}
              </div>

              {/* Total por vendedor */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {data.sellers
                  .filter(seller => seller.openQuotesCount > 0)
                  .sort((a, b) => (b.openQuotesValue || 0) - (a.openQuotesValue || 0))
                  .map((seller) => (
                    <div key={seller.id} className="glass-item rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-gray-800">
                          {seller.name.split(' ')[0]}
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatNumberHidden(seller.openQuotesCount)} {seller.openQuotesCount === 1 ? 'orçamento' : 'orçamentos'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Total:</span>
                        <span className="text-base font-bold text-green-money">
                          {formatCurrencyHidden(seller.openQuotesValue || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                {data.sellers.filter(seller => seller.openQuotesCount > 0).length === 0 && (
                  <div className="text-center text-sm text-gray-500 py-4">
                    Nenhum orçamento em aberto
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna 3: Vendas do Dia e Ranking */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
            {/* Vendas do Dia Atual */}
            <div className="glass-card-premium rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-royal-blue drop-shadow-sm">
                    Vendas de Hoje
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{today}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-money flex items-center justify-center text-white text-lg shadow-xl">
                  📅
                </div>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {todaySalesBySeller.map((seller, index) => (
                  <div
                    key={seller.sellerId}
                    className="glass-item rounded-xl p-4 transform hover:scale-[1.01] transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg"
                          style={{ backgroundColor: seller.color }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-800 drop-shadow-sm">
                            {seller.sellerName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatNumberHidden(seller.salesCount)} {seller.salesCount === 1 ? 'venda' : 'vendas'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-money drop-shadow-sm">
                          {formatCurrencyHidden(seller.salesTotal)}
                        </p>
                        {seller.salesTotal === 0 && (
                          <p className="text-xs text-gray-500 mt-1">Sem vendas hoje</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Barra de progresso */}
                    {seller.salesTotal > 0 && (
                      <div className="mt-3">
                        <div className="h-3 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 shadow-md"
                            style={{ 
                              width: `${(seller.salesTotal / Math.max(...todaySalesBySeller.map(s => s.salesTotal), 1)) * 100}%`,
                              backgroundColor: seller.color
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Total do Dia - Com animação premium */}
              <div className="mt-3 pt-3 border-t-2 border-white/30">
                <div className="glass-card-premium rounded-xl p-3 bg-gradient-to-br from-green-money/20 to-green-500/20 border-2 border-green-money/40 animate-premium-pulse">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-money to-green-500 flex items-center justify-center text-white text-lg shadow-xl flex-shrink-0">
                        💰
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                          Total Vendido Hoje
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5 whitespace-nowrap">Soma de todas as vendedoras</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 min-w-0">
                      <p className="text-xl font-bold text-green-money drop-shadow-sm animate-premium-pulse-text whitespace-nowrap">
                        {formatCurrencyHidden(totalTodaySales)}
                      </p>
                      {totalTodaySales > 0 && (
                        <p className="text-xs text-gray-600 mt-0.5 whitespace-nowrap">
                          {formatNumberHidden(todaySalesBySeller.reduce((sum, s) => sum + s.salesCount, 0))} {todaySalesBySeller.reduce((sum, s) => sum + s.salesCount, 0) === 1 ? 'venda' : 'vendas'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranking dos Vendedores */}
            <div className="glass-card-premium rounded-2xl p-4 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-royal-blue drop-shadow-sm">
                  Ranking
                </h2>
                <div className="w-7 h-7 rounded-lg bg-royal-blue flex items-center justify-center text-white text-xs shadow-xl">
                  👥
                </div>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {sellersWithGoal.map((seller, index) => {
                  const percentage = (seller.salesTotal / maxSales) * 100
                  const goalPercentage = Math.min(seller.individualProgress, 100)
                  return (
                    <div
                      key={seller.id}
                      className="glass-item rounded-lg p-3 transform hover:scale-[1.01] transition-all duration-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-royal-blue flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-800 drop-shadow-sm">
                              {seller.name.split(' ')[0]}
                            </h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-green-money drop-shadow-sm">
                            {formatCurrencyHidden(seller.salesTotal)}
                          </p>
                          {seller.hasReachedGoal ? (
                            <p className="text-xs text-green-money font-semibold">🎯 Meta!</p>
                          ) : (
                            <p className="text-xs text-royal-blue font-medium">
                              Falta: {formatCurrencyHidden(seller.remaining)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Barra de progresso da meta individual */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Meta: {formatCurrencyHidden(seller.individualGoal)}</span>
                          <span className={`text-xs font-bold ${seller.hasReachedGoal ? 'text-green-money' : 'text-royal-blue'}`}>
                            {formatPercentHidden(goalPercentage)}
                          </span>
                        </div>
                        <div className="h-2.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 shadow-md ${
                              seller.hasReachedGoal ? 'bg-green-money' : 'bg-royal-blue'
                            }`}
                            style={{ width: `${goalPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-royal-blue font-bold">✓</span>
                          <span className="text-gray-600 font-medium">{formatNumberHidden(seller.salesCount)} vendas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-green-money font-bold">📝</span>
                          <span className="text-gray-600 font-medium">{formatNumberHidden(seller.openQuotesCount)} orçamentos</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Coluna 4: Gráficos */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
            {/* Gráfico Pizza */}
            <div className="glass-card-premium rounded-xl md:rounded-2xl p-3 md:p-4 flex-1 flex flex-col min-h-[300px] md:min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm md:text-base font-bold text-royal-blue drop-shadow-sm">
                  Distribuição por Vendedor
                </h2>
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-royal-blue flex items-center justify-center text-white text-xs shadow-xl">
                  📊
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-[250px] md:min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={false}
                      outerRadius={80}
                      innerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={2000}
                      animationEasing="ease-out"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        fontSize: '13px',
                      }}
                      labelStyle={{
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '13px',
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      height={60}
                      formatter={(value: string) => {
                        const data = chartData.find(d => d.name === value)
                        const percent = data ? ((data.value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1) : '0'
                        return `${value.split(' ')[0]}: ${percent}%`
                      }}
                      wrapperStyle={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1f2937',
                        paddingTop: '10px',
                      }}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Barras */}
            <div className="glass-card-premium rounded-xl md:rounded-2xl p-3 md:p-4 flex-1 flex flex-col min-h-[300px] md:min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm md:text-base font-bold text-royal-blue drop-shadow-sm">
                  Comparativo Vendedores
                </h2>
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-green-money flex items-center justify-center text-white text-xs shadow-xl">
                  📈
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-[250px] md:min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 5, right: 10, left: 5, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: '#1f2937' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#1f2937' }}
                      tickFormatter={(value) => {
                        // Formatação inteligente: ajusta automaticamente conforme o valor
                        if (value >= 1000000) {
                          return `R$ ${(value / 1000000).toFixed(1)}M`
                        } else if (value >= 1000) {
                          return `R$ ${(value / 1000).toFixed(0)}k`
                        } else {
                          return `R$ ${value.toFixed(0)}`
                        }
                      }}
                      domain={[0, 'auto']}
                      allowDataOverflow={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                        fontSize: '12px',
                        padding: '10px',
                      }}
                      labelStyle={{
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '13px',
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[8, 8, 0, 0]}
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
