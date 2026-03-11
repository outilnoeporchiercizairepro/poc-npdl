import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CallTable } from '../components/CallTable'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'

export function CallsList({ onSelectCall }) {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchCalls() {
      setLoading(true)
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setCalls(data)
      setLoading(false)
    }
    fetchCalls()
  }, [])

const filteredCalls = calls.filter(call => 
    call.poste?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteCall = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette analyse ?")) return
    
    const { error } = await supabase
      .from('calls')
      .delete()
      .eq('id', id)

    if (error) {
      alert("Erreur lors de la suppression : " + error.message)
    } else {
      setCalls(calls.filter(c => c.id !== id))
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appels Analysés</h1>
          <p className="text-muted-foreground mt-1">Gérez et explorez l'historique complet des interactions clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un collaborateur ou client..."
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-80 text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-all border border-border shadow-sm text-sm font-medium">
            <SlidersHorizontal size={16} />
            Filtres
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground italic">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
           Chargement des analyses...
        </div>
      ) : (
        <CallTable 
          calls={filteredCalls} 
          onViewDetails={onSelectCall} 
          onDeleteCall={handleDeleteCall} 
        />
      )}
    </div>
  )
}
