import { useState, useEffect } from 'react'
import { X, Save, Loader2, Plus, Edit2, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOptions } from '../hooks/useOptions'

const LeadModal = ({ isOpen, onClose, onSave, lead = null, loading = false }) => {
  const { options, loading: optionsLoading, addOption, updateOption, deleteOption } = useOptions()
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fuente: '',
    producto_interes: '',
    vendedor: '',
    pipeline: 'Prospección',
    estado: 'Activo',
    comentarios: ''
  })

  const [errors, setErrors] = useState({})
  const [showOptionsManager, setShowOptionsManager] = useState(false)
  const [managingField, setManagingField] = useState(null) // 'fuente', 'pipeline', 'estado', 'vendedor'
  const [newOption, setNewOption] = useState('')
  const [editingOption, setEditingOption] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (lead) {
      setFormData({
        nombre: lead.nombre || '',
        telefono: lead.telefono || '',
        email: lead.email || '',
        fuente: lead.fuente || '',
        producto_interes: lead.producto_interes || '',
        vendedor: lead.vendedor || '',
        pipeline: lead.pipeline || 'Prospección',
        estado: lead.estado || 'Activo',
        comentarios: lead.comentarios || ''
      })
    } else {
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        fuente: '',
        producto_interes: '',
        vendedor: '',
        pipeline: 'Prospección',
        estado: 'Activo',
        comentarios: ''
      })
    }
    setErrors({})
    setShowOptionsManager(false)
    setManagingField(null)
    setIsSubmitting(false)
  }, [lead, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return // Prevenir doble envío
    
    console.log('Formulario enviado:', formData) // Debug
    
    if (!validateForm()) {
      console.log('Validación falló:', errors) // Debug
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Llamando onSave con:', formData) // Debug
      await onSave(formData)
      console.log('onSave completado') // Debug
    } catch (error) {
      console.error('Error en handleSubmit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Funciones para gestión de opciones
  const handleManageOptions = (field) => {
    setManagingField(field)
    setShowOptionsManager(true)
  }

  const handleAddOption = async () => {
    if (!newOption.trim() || !managingField) return
    
    try {
      const result = await addOption(managingField, newOption.trim())
      if (result.success) {
        setNewOption('')
      }
    } catch (error) {
      console.error('Error adding option:', error)
    }
  }

  const handleEditOption = (option) => {
    setEditingOption(option)
    setEditingValue(option)
  }

  const handleUpdateOption = async () => {
    if (!editingValue.trim() || !managingField || !editingOption) return
    
    try {
      const result = await updateOption(managingField, editingOption, editingValue.trim())
      if (result.success) {
        setEditingOption(null)
        setEditingValue('')
      }
    } catch (error) {
      console.error('Error updating option:', error)
    }
  }

  const handleDeleteOption = async (option) => {
    if (!managingField) return
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${option}"?`)) {
      try {
        await deleteOption(managingField, option)
      } catch (error) {
        console.error('Error deleting option:', error)
      }
    }
  }

  const getFieldLabel = (field) => {
    const labels = {
      fuente: 'Fuentes',
      pipeline: 'Etapas del Pipeline',
      estado: 'Estados',
      vendedor: 'Vendedores'
    }
    return labels[field] || field
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {lead ? 'Editar Lead' : 'Agregar Nuevo Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex">
          {/* Form Section */}
          <div className={`${showOptionsManager ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre completo del lead"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1234567890"
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Fuente */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Fuente
                    </label>
                    <button
                      type="button"
                      onClick={() => handleManageOptions('fuente')}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      title="Gestionar opciones"
                    >
                      <Settings size={14} className="mr-1" />
                      Gestionar
                    </button>
                  </div>
                  <select
                    name="fuente"
                    value={formData.fuente}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar fuente</option>
                    {(options.fuente || []).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Producto de Interés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto de Interés
                  </label>
                  <input
                    type="text"
                    name="producto_interes"
                    value={formData.producto_interes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Producto o servicio de interés"
                  />
                </div>

                {/* Vendedor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Vendedor Asignado
                    </label>
                    <button
                      type="button"
                      onClick={() => handleManageOptions('vendedor')}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      title="Gestionar opciones"
                    >
                      <Settings size={14} className="mr-1" />
                      Gestionar
                    </button>
                  </div>
                  <select
                    name="vendedor"
                    value={formData.vendedor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar vendedor</option>
                    {(options.vendedor || []).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Pipeline */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Etapa del Pipeline
                    </label>
                    <button
                      type="button"
                      onClick={() => handleManageOptions('pipeline')}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      title="Gestionar opciones"
                    >
                      <Settings size={14} className="mr-1" />
                      Gestionar
                    </button>
                  </div>
                  <select
                    name="pipeline"
                    value={formData.pipeline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {(options.pipeline || ['Prospección', 'Contacto', 'Negociación', 'Cierre']).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <button
                      type="button"
                      onClick={() => handleManageOptions('estado')}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      title="Gestionar opciones"
                    >
                      <Settings size={14} className="mr-1" />
                      Gestionar
                    </button>
                  </div>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {(options.estado || ['Activo', 'Inactivo']).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comentarios */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Notas adicionales sobre el lead..."
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  disabled={loading || isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {(loading || isSubmitting) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {lead ? 'Actualizar' : 'Crear'} Lead
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Options Manager Section */}
          {showOptionsManager && (
            <div className="w-1/3 border-l border-gray-200 bg-gray-50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Gestionar {getFieldLabel(managingField)}
                  </h3>
                  <button
                    onClick={() => setShowOptionsManager(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Add new option */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agregar nueva opción
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Nueva opción..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    />
                    <button
                      onClick={handleAddOption}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      disabled={!newOption.trim()}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Options list */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opciones existentes
                  </label>
                  {(options[managingField] || []).map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      {editingOption === option ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateOption()}
                          />
                          <button
                            onClick={handleUpdateOption}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingOption(null)
                              setEditingValue('')
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-sm">{option}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditOption(option)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteOption(option)}
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadModal

