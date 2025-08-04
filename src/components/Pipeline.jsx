import { useState } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'

const Pipeline = () => {
  const stages = [
    { id: 'prospeccion', name: 'Prospección', color: 'bg-blue-500' },
    { id: 'contacto', name: 'Contacto', color: 'bg-yellow-500' },
    { id: 'negociacion', name: 'Negociación', color: 'bg-orange-500' },
    { id: 'cierre', name: 'Cierre', color: 'bg-green-500' }
  ]

  const leads = [
    { id: 1, name: 'Juan Pérez', value: '$5,000', stage: 'prospeccion', company: 'Empresa A' },
    { id: 2, name: 'Ana García', value: '$8,000', stage: 'contacto', company: 'Empresa B' },
    { id: 3, name: 'Luis Martínez', value: '$12,000', stage: 'negociacion', company: 'Empresa C' },
    { id: 4, name: 'Carmen Silva', value: '$15,000', stage: 'cierre', company: 'Empresa D' },
    { id: 5, name: 'Pedro López', value: '$3,000', stage: 'prospeccion', company: 'Empresa E' },
    { id: 6, name: 'María Rodríguez', value: '$7,500', stage: 'contacto', company: 'Empresa F' }
  ]

  const getLeadsByStage = (stageId) => {
    return leads.filter(lead => lead.stage === stageId)
  }

  const getTotalValue = (stageId) => {
    return getLeadsByStage(stageId).reduce((total, lead) => {
      return total + parseInt(lead.value.replace('$', '').replace(',', ''))
    }, 0)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline de Ventas</h1>
        <p className="text-gray-600">Vista kanban del proceso de ventas</p>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id)
          const totalValue = getTotalValue(stage.id)
          
          return (
            <div key={stage.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Stage Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {stageLeads.length} leads • ${totalValue.toLocaleString()}
                </div>
              </div>

              {/* Stage Content */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">{lead.company}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600">{lead.value}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {lead.name.charAt(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No hay leads en esta etapa</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total en Pipeline</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${leads.reduce((total, lead) => total + parseInt(lead.value.replace('$', '').replace(',', '')), 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tasa de Conversión</h3>
          <p className="text-3xl font-bold text-green-600">24.5%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiempo Promedio</h3>
          <p className="text-3xl font-bold text-orange-600">18 días</p>
        </div>
      </div>
    </div>
  )
}

export default Pipeline

