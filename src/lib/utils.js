import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getScore(category, value) {
  return parseInt(value) || 0
}

export function getStatusColor(category, score) {
  const s = parseInt(score) || 0
  
  const colors = {
    0: "bg-slate-100 text-slate-500 border-slate-300",
    1: "bg-red-500/20 text-red-700 border-red-300",
    2: "bg-orange-500/20 text-orange-700 border-orange-300",
    3: "bg-amber-500/20 text-amber-700 border-amber-300",
    4: "bg-emerald-500/20 text-emerald-700 border-emerald-300",
    5: "bg-indigo-500/20 text-indigo-700 border-indigo-300",
  }
  
  return cn(
    "px-2 py-0.5 rounded-md font-bold text-[11px] border tracking-tight shadow-sm whitespace-nowrap min-w-[2.5rem] text-center",
    colors[s] || colors[0]
  )
}
