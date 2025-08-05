import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Calendar, 
  CreditCard, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  UserCog
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const baseMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leads', icon: Users, label: 'Leads' },
    { path: '/pipeline', icon: GitBranch, label: 'Pipeline' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/cobranza', icon: CreditCard, label: 'Cobranza' },
    { path: '/mensajeria', icon: MessageSquare, label: 'Mensajería' },
  ];

  const adminMenuItems = [
      { path: '/user-management', icon: UserCog, label: 'Usuarios' },
  ]

  const menuItems = user?.role === 'admin' ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 z-50 flex flex-col ${
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
      <nav className="mt-6 flex-1">
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

      {/* User Profile & Logout */}
      <div className="p-2">
        <div className={`flex items-center p-3 rounded-lg bg-white/10 mb-2 ${
          collapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate" title={user?.name}>
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-indigo-200 truncate" title={user?.email}>
                {user?.email || 'email@example.com'}
              </p>
            </div>
          )}
        </div>
        <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 mx-auto rounded-lg transition-all duration-200 group text-indigo-100 hover:bg-white/10 hover:text-white ${
                collapsed ? 'justify-center' : ''
            }`}
        >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && (
                <span className="ml-3 font-medium">Cerrar Sesión</span>
            )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar

