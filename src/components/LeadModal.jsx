import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LeadModal = ({ isOpen, onClose, onSave, lead = null, loading = false }) => {
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
  }, [lead, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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

        {/* Form */}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuente
              </label>
              <select
                name="fuente"
                value={formData.fuente}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Seleccionar fuente</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Web">Web</option>
                <option value="Referido">Referido</option>
                <option value="Llamada Fría">Llamada Fría</option>
                <option value="Evento">Evento</option>
                <option value="Otro">Otro</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendedor Asignado
              </label>
              <select
                name="vendedor"
                value={formData.vendedor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Seleccionar vendedor</option>
                <option value="María López">María López</option>
                <option value="Carlos Ruiz">Carlos Ruiz</option>
                <option value="Ana García">Ana García</option>
                <option value="Luis Martínez">Luis Martínez</option>
              </select>
            </div>

            {/* Pipeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etapa del Pipeline
              </label>
              <select
                name="pipeline"
                value={formData.pipeline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Prospección">Prospección</option>
                <option value="Contacto">Contacto</option>
                <option value="Negociación">Negociación</option>
                <option value="Cierre">Cierre</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
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
    </div>
  )
}

export default LeadModal

