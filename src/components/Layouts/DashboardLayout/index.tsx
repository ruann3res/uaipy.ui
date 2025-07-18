import { useState } from 'react'
import { Sidebar, MobileMenuButton } from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">UI</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">UaiPy</span>
            </div>
            <MobileMenuButton onClick={toggleSidebar} />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}