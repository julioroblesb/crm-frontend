import { useState } from 'react'
import { Send, Users, MessageSquare, Search, Plus, Eye } from 'lucide-react'

const Mensajeria = () => {
  const [selectedLeads, setSelectedLeads] = useState([])
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const inactiveLeads = [
    {
      id: 1,
      nombre: 'Pedro González',
      telefono: '+1234567894',
      fuente: 'Facebook',
      ultimoContacto: '2024-12-15',
      motivo: 'No respondió'
    },
    {
      id: 2,
      nombre: 'Laura Fernández',
      telefono: '+1234567895',
      fuente: 'Instagram',
      ultimoContacto: '2024-12-10',
      motivo: 'No interesado'
    },
    {
      id: 3,
      nombre: 'Roberto Díaz',
      telefono: '+1234567896',
      fuente: 'WhatsApp',
      ultimoContacto: '2024-12-08',
      motivo: 'Sin presupuesto'
    },
    {
      id: 4,
      nombre: 'Sofia Morales',
      telefono: '+1234567897',
      fuente: 'Referido',
      ultimoContacto: '2024-12-05',
      motivo: 'Perdió interés'
    },
    {
      id: 5,
      nombre: 'Miguel Torres',
      telefono: '+1234567898',
      fuente: 'Web',
      ultimoContacto: '2024-12-01',
      motivo: 'No respondió'
    }
  ]

  const campaigns = [
    {
      id: 1,
      nombre: 'Campaña Navidad 2024',
      fecha: '2024-12-20',
      destinatarios: 150,
      enviados: 150,
      respuestas: 23,
      estado: 'Completada'
    },
    {
      id: 2,
      nombre: 'Oferta Año Nuevo',
      fecha: '2025-01-01',
      destinatarios: 200,
      enviados: 180,
      respuestas: 15,
      estado: 'En progreso'
    },
    {
      id: 3,
      nombre: 'Reactivación Q1',
      fecha: '2025-01-15',
      destinatarios: 100,
      enviados: 0,
      respuestas: 0,
      estado: 'Programada'
    }
  ]

  const messageTemplates = [
    {
      id: 1,
      nombre: 'Reactivación General',
      mensaje: '¡Hola {nombre}! 👋 Esperamos que estés bien. Tenemos nuevas ofertas que podrían interesarte. ¿Te gustaría conocer más detalles?'
    },
    {
      id: 2,
      nombre: 'Oferta Especial',
      mensaje: 'Hola {nombre}, tenemos una oferta especial solo para ti con un 20% de descuento. ¡No te la pierdas! 🎉'
    },
    {
      id: 3,
      nombre: 'Seguimiento',
      mensaje: 'Hola {nombre}, hace tiempo que no hablamos. ¿Cómo has estado? Nos encantaría saber si podemos ayudarte con algo.'
    }
  ]

  const filteredLeads = inactiveLeads.filter(lead =>
    lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.telefono.includes(searchTerm)
  )

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
    }
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Completada': return 'bg-green-100 text-green-800'
      case 'En progreso': return 'bg-blue-100 text-blue-800'
      case 'Programada': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajería Masiva</h1>
        <p className="text-gray-600">Gestiona campañas de WhatsApp para leads inactivos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads Inactivos</p>
                  <p className="text-2xl font-bold text-gray-900">{inactiveLeads.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Seleccionados</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedLeads.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Campañas Activas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {campaigns.filter(c => c.estado !== 'Completada').length}
                  </p>
                </div>
                <Send className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Lead Selection Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Seleccionar Leads</h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-indigo-800"
                >
                  {selectedLeads.length === filteredLeads.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{lead.nombre}</div>
                        <div className="text-xs text-gray-500">{lead.motivo}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{lead.telefono}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {lead.fuente}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(lead.ultimoContacto).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Message Composer */}
        <div className="space-y-6">
          {/* Templates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plantillas</h3>
            <div className="space-y-2">
              {messageTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setMessage(template.mensaje)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{template.nombre}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{template.mensaje}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Componer Mensaje</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí... Usa {nombre} para personalizar."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {selectedLeads.length} destinatarios seleccionados
              </span>
              <button
                disabled={selectedLeads.length === 0 || !message.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Enviar Campaña</span>
              </button>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campañas Recientes</h3>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{campaign.nombre}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.estado)}`}>
                      {campaign.estado}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Fecha: {new Date(campaign.fecha).toLocaleDateString('es-ES')}</div>
                    <div>Enviados: {campaign.enviados}/{campaign.destinatarios}</div>
                    <div>Respuestas: {campaign.respuestas}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mensajeria

