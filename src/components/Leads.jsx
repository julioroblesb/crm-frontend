import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeads } from '../hooks/useLeads'
import LeadModal from './LeadModal'
import ExportModal from './ExportModal'

const Leads = () => {
  const { leads, loading, error, createLead, updateLead, deleteLead } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFilters, setExportFilters] = useState({
    vendedor: '',
    pipeline: '',
    fuente: '',
    estado: '',
    desde: '',
    hasta: ''
  })

  useEffect(() => {
    setExportFilters(prev => ({
      ...prev,
      pipeline: filterStage === 'all' ? '' : filterStage
    }))
  }, [filterStage])

  const handleExport = () => {
    const filtered = leads.filter(lead => {
      const matchVendedor = !exportFilters.vendedor || lead.vendedor === exportFilters.vendedor
      const matchPipeline = !exportFilters.pipeline || lead.pipeline === exportFilters.pipeline
      const matchFuente = !exportFilters.fuente || lead.fuente === exportFilters.fuente
      const matchEstado = !exportFilters.estado || lead.estado === exportFilters.estado

      const registro = new Date(lead.registro)
      const desde = exportFilters.desde ? new Date(exportFilters.desde) : null
      const hasta = exportFilters.hasta ? new Date(exportFilters.hasta) : null
      const matchFecha = (!desde || registro >= desde) && (!hasta || registro <= hasta)

      return matchVendedor && matchPipeline && matchFuente && matchEstado && matchFecha
    })

    const csvRows = []
    const headers = Object.keys(filtered[0] || {}).join(',')
    csvRows.push(headers)

    filtered.forEach(lead => {
      const row = Object.values(lead).map(val =>
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
      csvRows.push(row)
    })

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    setShowExportModal(false)
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefono.includes(searchTerm)

    const matchPipeline = !exportFilters.pipeline || lead.pipeline === exportFilters.pipeline
    const matchFuente = !exportFilters.fuente || lead.fuente === exportFilters.fuente
    const matchVendedor = !exportFilters.vendedor || lead.vendedor === exportFilters.vendedor
    const matchEstado = !exportFilters.estado || lead.estado === exportFilters.estado

    const registro = new Date(lead.registro)
    const desde = exportFilters.desde ? new Date(exportFilters.desde) : null
    const hasta = exportFilters.hasta ? new Date(exportFilters.hasta) : null
    const matchFecha = (!desde || registro >= desde) && (!hasta || registro <= hasta)

    return matchesSearch && matchPipeline && matchFuente && matchVendedor && matchEstado && matchFecha
  })

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const paginatedLeads = filteredLeads.slice(start, start + itemsPerPage)

  const getPipelineColor = (pipeline) => {
    const colors = {
      'Prospección': 'bg-blue-100 text-blue-800',
      'Contacto': 'bg-yellow-100 text-yellow-800',
      'Negociación': 'bg-orange-100 text-orange-800',
      'Cierre': 'bg-green-100 text-green-800'
    }
    return colors[pipeline] || 'bg-gray-100 text-gray-800'
  }

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
      const result = editingLead
        ? await updateLead(editingLead.id, leadData)
        : await createLead(leadData)

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
            <p className="text-gray-600">Gestiona todos tus leads y prospectos</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowExportModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              📁 Exportar Leads
            </Button>
            <Button onClick={handleCreateLead} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus size={20} />
              <span>Agregar Lead</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
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
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={exportFilters.estado}
                onChange={(e) => setExportFilters({ ...exportFilters, estado: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Filtrar por fuente..."
              className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3"
              value={exportFilters.fuente}
              onChange={(e) => setExportFilters({ ...exportFilters, fuente: e.target.value })}
            />
            <input
              type="text"
              placeholder="Filtrar por vendedor..."
              className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3"
              value={exportFilters.vendedor}
              onChange={(e) => setExportFilters({ ...exportFilters, vendedor: e.target.value })}
            />
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-2 w-full sm:w-1/6"
              value={exportFilters.desde}
              onChange={(e) => setExportFilters({ ...exportFilters, desde: e.target.value })}
            />
            <input
              type="date"
              className="border border-gray-300 rounded px-2 py-2 w-full sm:w-1/6"
              value={exportFilters.hasta}
              onChange={(e) => setExportFilters({ ...exportFilters, hasta: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {/* ... la tabla y paginación se mantiene igual ... */}

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

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        filters={exportFilters}
        setFilters={setExportFilters}
        onExport={handleExport}
      />
    </div>
  )
}

export default Leads
