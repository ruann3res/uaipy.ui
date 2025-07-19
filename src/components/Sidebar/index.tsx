import { 
  Home, 
  HardDrive,
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  Folder,
  Thermometer,
} from 'lucide-react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../ThemeToggle'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBlockedUser } from '@/hooks/useBlockedUser'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { icon: Home, label: 'Geral', href: '/', },
  { icon: Folder, label: 'Projetos', href: '/projects' },
  { icon: HardDrive, label: 'Dispositivos', href: '/devices' },
  { icon: Thermometer, label: 'Sensores', href: '/sensors' },
  { icon: BarChart3, label: 'Relatórios', href: '/reports' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  const { signOut } = useAuth()
  const { isBlocked } = useBlockedUser()

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const isActiveLink = (href: string) => {
    const currentPath = location.pathname
    
    if (href === '/') {
      return currentPath === '/'
    }

    return currentPath === href || currentPath.startsWith(href + '/')
  }

  const handleLinkClick = () => {
    if (isMobile) {
      onToggle()
    }
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UI</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">UaiPy</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigationItems
            .map((item) => {
              const isActive = isActiveLink(item.href)
              
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                    active:scale-95
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Link>
              )
            })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {isBlocked && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Acesso limitado:</strong> Crie uma nova conta para acessar todas as funcionalidades.
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Tema</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Sair
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}