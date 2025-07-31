import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Users, DollarSign, Target, Calendar, Phone, Mail, MessageSquare, Loader2 } from 'lucide-react'
import { useDashboard } from '../hooks/useLeads'

const Dashboard = () => {
  const { metrics, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando métricas del dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar las métricas</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Asegúrate de que el backend esté ejecutándose y Google Sheets esté configurado correctamente.
          </p>
        </div>
      </div>
    )
  }

  // Datos por defecto si no hay métricas
  const defaultMetrics = {
    total_leads: 0,
    pipeline_distribution: {},
    source_distribution: {},
    upcoming_tasks: []
  }

  const data = metrics || defaultMetrics

  // Preparar datos para gráficos
  const pipelineData = Object.entries(data.pipeline_distribution || {}).map(([stage, count]) => ({
    stage,
    count,
    color: {
      'Prospección': '#3B82F6',
      'Contacto': '#F59E0B', 
      'Negociación': '#F97316',
      'Cierre': '#10B981'
    }[stage] || '#6B7280'
  }))

  const sourceData = Object.entries(data.source_distribution || {}).map(([source, count]) => ({
    source,
    count
  }))

  const COLORS = ['#3B82F6', '#F59E0B', '#F97316', '#10B981', '#8B5CF6', '#EF4444']

  // Datos de ejemplo para gráficos adicionales
  const monthlyData = [
    { month: 'Ene', leads: 45, conversions: 12 },
    { month: 'Feb', leads: 52, conversions: 15 },
    { month: 'Mar', leads: 48, conversions: 18 },
    { month: 'Abr', leads: 61, conversions: 22 },
    { month: 'May', leads: 55, conversions: 19 },
    { month: 'Jun', leads: 67, conversions: 25 }
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu CRM y métricas de ventas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{data.total_leads}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                +12% vs mes anterior
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversiones</p>
              <p className="text-3xl font-bold text-gray-900">{data.pipeline_distribution?.Cierre || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                +8% vs mes anterior
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.total_leads > 0 ? Math.round(((data.pipeline_distribution?.Cierre || 0) / data.total_leads) * 100) : 0}%
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                +3% vs mes anterior
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{data.upcoming_tasks?.length || 0}</p>
              <p className="text-sm text-orange-600 mt-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Para esta semana
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución del Pipeline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Leads</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias Mensuales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} name="Leads" />
                <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversiones" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Tareas</h3>
          <div className="space-y-4">
            {data.upcoming_tasks?.slice(0, 5).map((task, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{task.action}</p>
                  <p className="text-sm text-gray-500">{task.lead_name}</p>
                  <p className="text-xs text-gray-400">{task.date}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No hay tareas programadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

