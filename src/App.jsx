import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Leads from './components/Leads'
import Pipeline from './components/Pipeline'
import Calendar from './components/Calendar'
import Cobranza from './components/Cobranza'
import Mensajeria from './components/Mensajeria'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <Router>
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
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

