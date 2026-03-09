import React from 'react'
import { cn, getStatusColor } from '../lib/utils'
import { ExternalLink, MessageSquare, AlertTriangle } from 'lucide-react'

export function CallTable({ calls, onViewDetails }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground font-semibold border-b border-border">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Poste</th>
            <th className="px-6 py-4">Accueil</th>
            <th className="px-6 py-4">Réponses</th>
            <th className="px-6 py-4">Ton</th>
            <th className="px-6 py-4">Satisfaction</th>
            <th className="px-6 py-4 text-right">Détails</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {calls.map((call) => (
            <tr key={call.id} className="hover:bg-secondary/30 transition-colors group">
              <td className="px-6 py-4 font-medium italic text-muted-foreground whitespace-nowrap">
                {new Date(call.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-primary/80 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                  {call.poste}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className={getStatusColor('accueil_collaborateur', call.accueil_collaborateur)}>
                    {call.accueil_collaborateur}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-bold">/5</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className={getStatusColor('qualite_reponses', call.qualite_reponses)}>
                    {call.qualite_reponses}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-bold">/5</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className={getStatusColor('ton_collaborateur', call.ton_collaborateur)}>
                    {call.ton_collaborateur}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-bold">/5</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className={getStatusColor('satisfaction_client', call.satisfaction_client)}>
                    {call.satisfaction_client}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-bold">/5</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onViewDetails(call)}
                  className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-all"
                >
                  <ExternalLink size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
