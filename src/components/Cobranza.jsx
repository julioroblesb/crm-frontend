import { useState, useMemo } from 'react'
import { Search, Filter, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// Mock Data
const allCobranzaData = [
    { id: 1, cliente: 'Juan Pérez', telefono: '+1234567890', email: 'juan@email.com', montoTotal: 15000, montoPendiente: 7500, fechaVenta: '2025-01-15', fechaVencimiento: '2025-02-15', comprobante: 'Sin Comprobante', estado: 'Pendiente', diasVencido: 0, ownerId: 2 },
    { id: 2, cliente: 'Ana García', telefono: '+1234567891', email: 'ana@email.com', montoTotal: 25000, montoPendiente: 12500, fechaVenta: '2025-01-10', fechaVencimiento: '2025-02-10', comprobante: 'Con Comprobante', estado: 'Vencido', diasVencido: 5, ownerId: 3 },
    { id: 3, cliente: 'Luis Martínez', telefono: '+1234567892', email: 'luis@email.com', montoTotal: 18000, montoPendiente: 0, fechaVenta: '2025-01-20', fechaVencimiento: '2025-02-20', comprobante: 'Con Comprobante', estado: 'Pagado', diasVencido: 0, ownerId: 2 },
    { id: 4, cliente: 'Carmen Silva', telefono: '+1234567893', email: 'carmen@email.com', montoTotal: 30000, montoPendiente: 20000, fechaVenta: '2025-01-05', fechaVencimiento: '2025-02-05', comprobante: 'Sin Comprobante', estado: 'Vencido', diasVencido: 10, ownerId: 1 },
];

const Cobranza = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const cobranzaData = useMemo(() => {
    if (user?.role === 'admin') {
        return allCobranzaData;
    }
    return allCobranzaData.filter(item => item.ownerId === user?.id);
  }, [user]);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pagado': return 'bg-green-100 text-green-800'
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'Vencido': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Pagado': return <CheckCircle size={16} />
      case 'Pendiente': return <Clock size={16} />
      case 'Vencido': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const filteredData = cobranzaData.filter(item => {
    const matchesSearch = item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.telefono.includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || item.estado === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPendiente = cobranzaData.reduce((sum, item) => sum + item.montoPendiente, 0)
  const totalVencido = cobranzaData.filter(item => item.estado === 'Vencido').reduce((sum, item) => sum + item.montoPendiente, 0)
  const totalPagado = cobranzaData.filter(item => item.estado === 'Pagado').reduce((sum, item) => sum + item.montoTotal, 0)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cobranza</h1>
        <p className="text-gray-600">Gestiona los pagos pendientes y a crédito</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pendiente</p>
              <p className="text-2xl font-bold text-orange-600">${totalPendiente.toLocaleString()}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Vencido</p>
              <p className="text-2xl font-bold text-red-600">${totalVencido.toLocaleString()}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Cobrado</p>
              <p className="text-2xl font-bold text-green-600">${totalPagado.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente, email o teléfono..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Vencido">Vencido</option>
            <option value="Pagado">Pagado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comprobante
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.cliente}</div>
                      <div className="text-sm text-gray-500">{item.telefono}</div>
                      <div className="text-sm text-gray-500">{item.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Total: ${item.montoTotal.toLocaleString()}
                      </div>
                      <div className={`text-sm font-semibold ${
                        item.montoPendiente > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        Pendiente: ${item.montoPendiente.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        Venta: {new Date(item.fechaVenta).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Vence: {new Date(item.fechaVencimiento).toLocaleDateString('es-ES')}
                      </div>
                      {item.diasVencido > 0 && (
                        <div className="text-xs text-red-600 font-medium">
                          {item.diasVencido} días vencido
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.estado)}`}>
                      {getStatusIcon(item.estado)}
                      <span className="ml-1">{item.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.comprobante === 'Con Comprobante' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.comprobante}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                        Gestionar
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                        Marcar Pagado
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Cobranza

