'use client'

import { LayoutGrid, Archive, Sparkles, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SidebarProps {
  open?: boolean
}

export function Sidebar({ open = true }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'archive', label: 'Document Archive', icon: Archive },
    { id: 'restoration', label: 'Image Restoration Lab', icon: Sparkles },
    { id: 'members', label: 'Member Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40',
        open ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          {open && <span className="font-serif text-lg font-bold text-sidebar-foreground">Archive</span>}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/40'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 border border-transparent'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {open && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
        <div className="glass-dark p-4 rounded-lg text-center">
          <div className="text-xs text-sidebar-foreground/70 font-medium">
            {open ? 'Premium Hub' : 'v1.0'}
          </div>
        </div>
      </div>
    </aside>
  )
}

export function DashboardSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return <Sidebar open={open} />
}
