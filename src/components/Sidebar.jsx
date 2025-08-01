import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Calendar, 
  CreditCard, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/cobranza', icon: CreditCard, label: 'Cobranza' },
    { path: '/mensajeria', icon: MessageSquare, label: 'Mensajería' },
  ]

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500/30">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-lg">CRM Leads</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <div className={`flex items-center p-3 rounded-lg bg-white/10 ${
          collapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Usuario Admin
              </p>
              <p className="text-xs text-indigo-200 truncate">
                admin@crm.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar

