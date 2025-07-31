import { useState } from 'react'
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeads } from '../hooks/useLeads'
import LeadModal from './LeadModal'

const Leads = () => {
  const { leads, loading, error, createLead, updateLead, deleteLead } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  const getPipelineColor = (pipeline) => {
    const colors = {
      'Prospección': 'bg-blue-100 text-blue-800',
      'Contacto': 'bg-yellow-100 text-yellow-800',
      'Negociación': 'bg-orange-100 text-orange-800',
      'Cierre': 'bg-green-100 text-green-800'
    }
    return colors[pipeline] || 'bg-gray-100 text-gray-800'
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.telefono.includes(searchTerm)
    const matchesFilter = filterStage === 'all' || lead.pipeline === filterStage
    return matchesSearch && matchesFilter && lead.estado === 'Activo'
  })

  const handleCreateLead = () => {
    setEditingLead(null)
    setShowModal(true)
  }

  const handleEditLead = (lead) => {
    setEditingLead(lead)
    setShowModal(true)
  }

  const handleSaveLead = async (leadData) => {
    setModalLoading(true)
    try {
      let result
      if (editingLead) {
        result = await updateLead(editingLead.id, leadData)
      } else {
        result = await createLead(leadData)
      }
      
      if (result.success) {
        setShowModal(false)
        setEditingLead(null)
      }
    } catch (error) {
      console.error('Error saving lead:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lead?')) {
      await deleteLead(leadId)
    }
  }

  if (loading && leads.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando leads...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar los leads</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <p className="text-red-600 text-sm mt-2">
            Asegúrate de que el backend esté ejecutándose y Google Sheets esté configurado correctamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
            <p className="text-gray-600">Gestiona todos tus leads y prospectos</p>
          </div>
          <Button 
            onClick={handleCreateLead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Agregar Lead</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
            >
              <option value="all">Todas las etapas</option>
              <option value="Prospección">Prospección</option>
              <option value="Contacto">Contacto</option>
              <option value="Negociación">Negociación</option>
              <option value="Cierre">Cierre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pipeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.nombre}</div>
                      <div className="text-sm text-gray-500">{lead.producto_interes}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{lead.telefono}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {lead.fuente}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPipelineColor(lead.pipeline)}`}>
                      {lead.pipeline}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.vendedor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.registro ? new Date(lead.registro).toLocaleDateString('es-ES') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-indigo-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditLead(lead)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron leads que coincidan con los filtros.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredLeads.length}</span> de{' '}
                  <span className="font-medium">{filteredLeads.length}</span> resultados
                </p>
              </div>
              {loading && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">Sincronizando...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <LeadModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingLead(null)
        }}
        onSave={handleSaveLead}
        lead={editingLead}
        loading={modalLoading}
      />
    </div>
  )
}

export default Leads

