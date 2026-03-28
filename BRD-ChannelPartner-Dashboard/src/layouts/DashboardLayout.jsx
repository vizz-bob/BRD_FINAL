import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import './DashboardLayout.css'

// Map route path → sidebar activeId
const pathToId = {
  '/dashboard/dashboard':           'dashboard',
  '/dashboard/update-agent':         'update-agent',
  '/dashboard/update-payout':        'update-payout',
  '/dashboard/update-repayment':     'update-repayment',
  '/dashboard/agent-performance':    'agent-performance',
  '/dashboard/performance-template': 'performance-template',
  '/dashboard/manage-tenants':       'manage-tenants',
  '/dashboard/promotional-offers':   'promotional-offers',
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeId = pathToId[location.pathname] || 'agent-performance'

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSelect = (id) => {
    navigate(`/dashboard/${id}`)
  }

  return (
    <div className="dashboard-root">
      <Sidebar
        activeId={activeId}
        onSelect={handleSelect}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="dashboard-main">
        <Header
          activeId={activeId}
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}