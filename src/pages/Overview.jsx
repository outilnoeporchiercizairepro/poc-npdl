import React, { useEffect, useState } from 'react'
import { StatCard } from '../components/StatCard'
import { Phone, Users, CheckCircle, AlertCircle, Clock, Smile } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getScore } from '../lib/utils'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'

export function Overview() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    avgSatisfaction: 0,
    avgQuality: 0,
    avgTon: 0,
    avgAccueil: 0,
    chartData: [],
    distribution: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      const { data: calls } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: true })

      if (calls && calls.length > 0) {
        // Compute KPIs
        const total = calls.length
        const totalSatisfaction = calls.reduce((acc, c) => acc + getScore('satisfaction_client', c.satisfaction_client), 0)
        const totalQuality = calls.reduce((acc, c) => acc + getScore('qualite_reponses', c.qualite_reponses), 0)
        const totalTon = calls.reduce((acc, c) => acc + getScore('ton_collaborateur', c.ton_collaborateur), 0)
        const totalAccueil = calls.reduce((acc, c) => acc + getScore('accueil_collaborateur', c.accueil_collaborateur), 0)

        // ... (distribution logic remains similar but centered on global health if needed)
        const distMap = calls.reduce((acc, c) => {
          const key = c.satisfaction_client
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})

        const colors = {
          '5': '#6366f1', // Indigo
          '4': '#10b981', // Emerald
          '3': '#f59e0b', // Amber
          '2': '#f97316', // Orange
          '1': '#ef4444', // Red
          '0': '#94a3b8'  // Slate
        }

        const distribution = Object.entries(distMap).map(([score, count]) => ({
          name: `Score ${score}/5`,
          value: Math.round((count / total) * 100),
          color: colors[score] || '#94a3b8',
          score: parseInt(score)
        })).sort((a, b) => b.score - a.score)

        // Compute Time Series (Volume)
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        const timeMap = calls.reduce((acc, c) => {
          const day = days[new Date(c.created_at).getDay()]
          if (!acc[day]) acc[day] = { name: day, volume: 0, quality: 0, count: 0 }
          acc[day].volume++
          acc[day].quality += getScore('satisfaction_client', c.satisfaction_client)
          acc[day].count++
          return acc
        }, {})

        setStats({
          totalCalls: total,
          avgSatisfaction: (totalSatisfaction / total).toFixed(1),
          avgQuality: (totalQuality / total).toFixed(1),
          avgTon: (totalTon / total).toFixed(1),
          avgAccueil: (totalAccueil / total).toFixed(1),
          chartData: Object.values(timeMap),
          distribution
        })
      }
      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
       <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
       Chargement des données temps-réel...
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">Tableau de Bord AI</h1>
        <p className="text-muted-foreground mt-1 font-medium">Analyse qualitative basée sur 4 indicateurs clés.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Satisfaction" 
          value={`${stats.avgSatisfaction}/5`} 
          icon={Smile} 
          trend="up" 
          trendValue="0" 
          description="Client" 
        />
        <StatCard 
          label="Qualité" 
          value={`${stats.avgQuality}/5`} 
          icon={CheckCircle} 
          trend="up" 
          trendValue="0" 
          description="Réponses" 
        />
        <StatCard 
          label="Ton" 
          value={`${stats.avgTon}/5`} 
          icon={Phone} 
          trend="up" 
          trendValue="0" 
          description="Attitude" 
        />
        <StatCard 
          label="Accueil" 
          value={`${stats.avgAccueil}/5`} 
          icon={Clock} 
          trend="up" 
          trendValue="0" 
          description="Collaborateur" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Volume d'Appels par Jour</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Distribution de la Satisfaction</h3>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-bold text-xl">
                  {stats.avgSatisfaction}
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-8">
              {stats.distribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-semibold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
