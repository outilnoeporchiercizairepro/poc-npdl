import React from 'react'
import { Sidebar } from './Sidebar'

export function Layout({ children, activeTab, setActiveTab }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 p-8 transition-transform duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
