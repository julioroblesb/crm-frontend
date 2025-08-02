import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Edit, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeads } from '../hooks/useLeads'
import { useOptions } from '../hooks/useOptions'
import LeadModal from './LeadModal'
import ExportModal from './ExportModal'

const Leads = () => {
  const { leads, loading, error, createLead, updateLead, deleteLead } = useLeads()
  const { options, loading: optionsLoading } = useOptions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [filterEstado, setFilterEstado] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [editingCell, setEditingCell] = useState(null)
  const [editingValue, setEditingValue] = useState('')
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

  const normalizeLead = (lead) => ({
    id: lead.ID,
    nombre: lead.NOMBRE || '',
    email: lead.EMAIL || '',
    telefono: lead.TELEFONO || '',
    fuente: lead.FUENTE || '',
    pipeline: lead.PRODUCTO_INTERES || '',
    estado: lead.ESTADO || '',
    vendedor: lead.VENDEDOR || '',
    registro: lead.FECHA_REGISTRO || ''
  })

  const normalizedLeads = leads
    .filter(lead => lead && lead.ID)
    .map(normalizeLead)

  useEffect(() => {
    setExportFilters(prev => ({
      ...prev,
      pipeline: filterStage === 'all' ? '' : filterStage,
      estado: filterEstado === 'all' ? '' : filterEstado
    }))
  }, [filterStage, filterEstado])

  const filteredLeads = normalizedLeads.filter(lead => {
    const matchesSearch =
      lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefono.includes(searchTerm)
    const matchPipeline = !exportFilters.pipeline || lead.pipeline === exportFilters.pipeline
    const matchFuente = !exportFilters.fuente || lead.fuente === exportFilters.fuente
    const matchVendedor = !exportFilters.vendedor || lead.vendedor === exportFilters.vendedor
    const matchEstado = filterEstado === 'all' || lead.estado === filterEstado
    const registro = new Date(lead.registro)
    const desde = exportFilters.desde ? new Date(exportFilters.desde) : null
    const hasta = exportFilters.hasta ? new Date(exportFilters.hasta) : null
    const matchFecha = (!desde || registro >= desde) && (!hasta || registro <= hasta)
    return matchesSearch && matchPipeline && matchFuente && matchVendedor && matchFecha && matchEstado
  })

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const paginatedLeads = filteredLeads.slice(start, start + itemsPerPage)

  const renderEditableCell = (lead, field, value) => {
    const isEditing = editingCell?.leadId === lead.id && editingCell?.field === field
    const fieldOptions = options[field] || []

    if (isEditing) {
      return (
        <div className="flex items-center space-x-1">
          {(field === 'fuente' || field === 'pipeline' || field === 'estado' || field === 'vendedor') ? (
            <select
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border rounded text-sm min-w-[120px]"
              autoFocus
            >
              <option value="">Seleccionar...</option>
              {fieldOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="px-2 py-1 border rounded text-sm min-w-[120px]"
              autoFocus
            />
          )}
          <button onClick={handleCellSave} className="text-green-600 hover:text-green-800" title="Guardar">
            <Check size={14} />
          </button>
          <button onClick={handleCellCancel} className="text-red-600 hover:text-red-800" title="Cancelar">
            <X size={14} />
          </button>
        </div>
      )
    }

    return (
      <div
        onClick={() => handleCellClick(lead.id, field, value)}
        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        title="Clic para editar"
      >
        {value || '-'}
      </div>
    )
  }

  const handleCellClick = (leadId, field, currentValue) => {
    setEditingCell({ leadId, field })
    setEditingValue(currentValue)
  }

  const handleCellSave = async () => {
    if (!editingCell) return
    const { leadId, field } = editingCell
    const leadData = { [field]: editingValue }
    try {
      await updateLead(leadId, leadData)
      setEditingCell(null)
      setEditingValue('')
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditingValue('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleCellSave()
    else if (e.key === 'Escape') handleCellCancel()
  }

  const handleCreateLead = () => {
    setEditingLead(null)
    setShowModal(true)
  }

  const handleEditLead = (lead) => {
    setEditingLead(lead)
    setShowModal(true)
  }

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lead?')) {
      await deleteLead(leadId)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <Button onClick={handleCreateLead} className="flex items-center gap-2">
          <Plus size={16} /> Nuevo lead
        </Button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <div className="overflow-auto rounded border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Email</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Fuente</th>
                <th className="p-2">Producto</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Vendedor</th>
                <th className="p-2">Registro</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="p-2">{renderEditableCell(lead, 'nombre', lead.nombre)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'email', lead.email)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'telefono', lead.telefono)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'fuente', lead.fuente)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'pipeline', lead.pipeline)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'estado', lead.estado)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'vendedor', lead.vendedor)}</td>
                  <td className="p-2">{renderEditableCell(lead, 'registro', lead.registro)}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEditLead(lead)} title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteLead(lead.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Leads
