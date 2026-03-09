import React from 'react'
import { cn } from '../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatCard({ label, value, description, trend, trendValue, icon: Icon }) {
  const isPositive = trend === 'up'
  
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors",
          "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        )}>
          {Icon && <Icon size={24} />}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-600">{label}</h3>
        <p className="text-4xl font-black mt-1 tracking-tighter text-slate-900">{value}</p>
        {description && <p className="text-xs text-muted-foreground/80 mt-2 font-medium">{description}</p>}
      </div>
    </div>
  )
}
