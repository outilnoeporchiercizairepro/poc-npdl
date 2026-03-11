import React from 'react'
import { LayoutDashboard, Users, Phone, BarChart3, LogOut, ChevronRight, Mic } from 'lucide-react'
import { cn } from '../lib/utils'
import { supabase } from '../lib/supabase'

const navItems = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", id: 'overview' },
  { icon: Phone, label: 'Journal des Appels', id: 'calls' },
  { icon: Mic, label: 'Analyser un appel', id: 'analyze' },
]

export function Sidebar({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <BarChart3 size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">CallAnalytics</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-primary-foreground" : "group-hover:text-foreground"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60">
                <ChevronRight size={14} />
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 py-6 mt-auto border-t border-border">
        <button 
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  )
}
