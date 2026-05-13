'use client'

import { Menu, Search, Bell, User } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-20 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Image Restoration Hub
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/30 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search archives..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-foreground w-32"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-secondary/50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Account</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export function DashboardHeader({ onMenuClick }: HeaderProps) {
  return <Header onMenuClick={onMenuClick} />
}
