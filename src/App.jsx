import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Leads from './components/Leads'
import Pipeline from './components/Pipeline'
import Calendar from './components/Calendar'
import Cobranza from './components/Cobranza'
import Mensajeria from './components/Mensajeria'
import Login from './components/Login'
import UserManagement from './components/UserManagement'
import './App.css'

// A wrapper for routes that require authentication.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// A wrapper for routes that require admin role.
const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (user?.role !== 'admin') {
        // Redirect to a 'not authorized' page or to the dashboard
        return <Navigate to="/" replace />;
    }
    return children;
}

const CrmLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/pipeline" element={<Pipeline />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/cobranza" element={<Cobranza />} />
                    <Route path="/mensajeria" element={<Mensajeria />} />
                    <Route
                        path="/user-management"
                        element={
                            <AdminRoute>
                                <UserManagement />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    )
}


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <CrmLayout />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </Router>
  )
}

export default App
