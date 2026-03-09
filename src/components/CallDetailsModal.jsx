import React from 'react'
import { X, CheckCircle, AlertCircle, PlayCircle, MessageCircle, Lightbulb, ChevronRight } from 'lucide-react'
import { cn, getStatusColor } from '../lib/utils'

export function CallDetailsModal({ call, isOpen, onClose }) {
  if (!isOpen || !call) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-background shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold italic">Analyse Qualitative (0-5)</h2>
            <p className="text-sm text-muted-foreground mt-1">Évaluation transverse • {call.poste}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Context */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Poste / Service</p>
              <div className="text-lg font-bold text-primary">
                {call.poste}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-secondary/30">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Durée</p>
              <div className="text-lg font-bold text-foreground">
                {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-primary">
              <CheckCircle size={18} />
              Évaluation AI
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Satisfaction Client", value: call.satisfaction_client, cat: 'satisfaction_client' },
                { label: "Accueil Collaborateur", value: call.accueil_collaborateur, cat: 'accueil_collaborateur' },
                { label: "Ton & Attitude", value: call.ton_collaborateur, cat: 'ton_collaborateur' },
                { label: "Qualité de la Réponse", value: call.qualite_reponses, cat: 'qualite_reponses' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border/50">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={getStatusColor(item.cat, item.value)}>
                      {item.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold">/ 5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-primary">
              <MessageCircle size={20} />
              Résumé Magique AI
            </h3>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-base leading-relaxed text-foreground/90 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <span className="relative z-10 italic">"{call.summary}"</span>
            </div>
          </div>

          {/* Transcript Section */}
          <div className="space-y-4 pb-12">
            <h3 className="font-bold flex items-center gap-2 text-primary">
              <PlayCircle size={20} />
              Transcription Complète
            </h3>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-[500px] overflow-y-auto font-sans custom-scrollbar shadow-inner relative">
              {call.transcript ? (
                <div className="space-y-4">
                  {call.transcript.split('\n').map((line, i) => {
                    const isClient = line.toLowerCase().startsWith('client')
                    return (
                      <div key={i} className={cn(
                        "p-4 rounded-2xl max-w-[85%] shadow-sm transition-all hover:scale-[1.01]",
                        isClient 
                          ? "bg-secondary/50 text-foreground ml-0 mr-auto border border-border" 
                          : "bg-primary text-primary-foreground ml-auto mr-0 border border-primary/20"
                      )}>
                        <p className={cn(
                          "text-[10px] font-black uppercase tracking-widest mb-1 opacity-70",
                          !isClient && "text-primary-foreground/80"
                        )}>
                          {line.split(':')[0]}
                        </p>
                        <p className="text-sm font-medium leading-relaxed">
                          {line.split(':').slice(1).join(':').trim()}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground italic flex flex-col items-center gap-3">
                  <AlertCircle size={32} className="opacity-20" />
                  Aucune transcription disponible pour cet appel.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
