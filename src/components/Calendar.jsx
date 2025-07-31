import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, Phone, Mail } from 'lucide-react'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day

  const tasks = [
    {
      id: 1,
      title: 'Llamar a Juan Pérez',
      lead: 'Juan Pérez',
      type: 'call',
      date: '2025-07-30',
      time: '10:00',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Enviar propuesta a Ana García',
      lead: 'Ana García',
      type: 'email',
      date: '2025-07-30',
      time: '14:30',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Reunión con Luis Martínez',
      lead: 'Luis Martínez',
      type: 'meeting',
      date: '2025-07-31',
      time: '11:00',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Seguimiento Carmen Silva',
      lead: 'Carmen Silva',
      type: 'call',
      date: '2025-08-01',
      time: '09:30',
      status: 'pending'
    }
  ]

  const getTaskIcon = (type) => {
    switch (type) {
      case 'call': return <Phone size={16} />
      case 'email': return <Mail size={16} />
      case 'meeting': return <Clock size={16} />
      default: return <Clock size={16} />
    }
  }

  const getTaskColor = (type) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-800'
      case 'email': return 'bg-green-100 text-green-800'
      case 'meeting': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const todayTasks = tasks.filter(task => task.date === '2025-07-30')
  const upcomingTasks = tasks.filter(task => new Date(task.date) > new Date('2025-07-30'))

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendario</h1>
            <p className="text-gray-600">Gestiona tus tareas y seguimientos</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus size={20} />
            <span>Nueva Tarea</span>
          </button>
        </div>

        {/* View Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {['day', 'week', 'month'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === viewType
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {viewType === 'day' ? 'Día' : viewType === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white rounded-lg border border-gray-200">
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {currentDate.toLocaleDateString('es-ES', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <button className="p-2 hover:bg-white rounded-lg border border-gray-200">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista del Calendario</h3>
            
            {/* Simple Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6 // Adjust for month start
                const isToday = day === 30
                const hasTasks = tasks.some(task => 
                  new Date(task.date).getDate() === day && day > 0 && day <= 31
                )
                
                return (
                  <div
                    key={i}
                    className={`p-2 text-center text-sm border border-gray-100 min-h-[40px] ${
                      day <= 0 || day > 31
                        ? 'text-gray-300 bg-gray-50'
                        : isToday
                        ? 'bg-blue-600 text-white font-semibold'
                        : hasTasks
                        ? 'bg-blue-50 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {day > 0 && day <= 31 ? day : ''}
                    {hasTasks && day > 0 && day <= 31 && (
                      <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tasks Sidebar */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas de Hoy</h3>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`p-1 rounded ${getTaskColor(task.type)}`}>
                        {getTaskIcon(task.type)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{task.time}</span>
                    </div>
                    {task.status === 'completed' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Completada
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                  <p className="text-xs text-gray-500">{task.lead}</p>
                </div>
              ))}
              
              {todayTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay tareas programadas para hoy
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Tareas</h3>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`p-1 rounded ${getTaskColor(task.type)}`}>
                      {getTaskIcon(task.type)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(task.date).toLocaleDateString('es-ES')} - {task.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                  <p className="text-xs text-gray-500">{task.lead}</p>
                </div>
              ))}
              
              {upcomingTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay tareas próximas
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar

