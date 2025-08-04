import React from 'react'
import { X } from 'lucide-react'

const ExportModal = ({ isOpen, onClose, filters, setFilters, onExport }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Exportar Leads</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendedor</label>
            <input
              type="text"
              value={filters.vendedor}
              onChange={(e) => setFilters({ ...filters, vendedor: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pipeline</label>
            <select
              value={filters.pipeline}
              onChange={(e) => setFilters({ ...filters, pipeline: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Todos</option>
              <option value="Prospección">Prospección</option>
              <option value="Contacto">Contacto</option>
              <option value="Negociación">Negociación</option>
              <option value="Cierre">Cierre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fuente</label>
            <input
              type="text"
              value={filters.fuente}
              onChange={(e) => setFilters({ ...filters, fuente: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Desde</label>
            <input
              type="date"
              value={filters.desde}
              onChange={(e) => setFilters({ ...filters, desde: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hasta</label>
            <input
              type="date"
              value={filters.hasta}
              onChange={(e) => setFilters({ ...filters, hasta: e.target.value })}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
