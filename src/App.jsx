import React, { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { Overview } from './pages/Overview'
import { CallsList } from './pages/CallsList'
import { CallDetailsModal } from './components/CallDetailsModal'
import { Login } from './pages/Login'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCall, setSelectedCall] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'calls': return <CallsList onSelectCall={(call) => setSelectedCall(call)} />
      case 'insights': return <div className="p-8 rounded-2xl bg-secondary/30 border border-dashed border-border flex items-center justify-center text-muted-foreground h-64 italic">Module Insights IA en cours de développement...</div>
      default: return <Overview />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      <CallDetailsModal 
        call={selectedCall} 
        isOpen={!!selectedCall} 
        onClose={() => setSelectedCall(null)} 
      />
    </Layout>
  )
}

export default App
