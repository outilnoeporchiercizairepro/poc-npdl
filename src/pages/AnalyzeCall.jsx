import React, { useState, useRef } from 'react'
import { Upload, FileAudio, Loader2, CheckCircle2, XCircle, Database, Trash2, Send, Mic, Play, Pause } from 'lucide-react'
import { cn } from '../lib/utils'
import { supabase } from '../lib/supabase'

export function AnalyzeCall() {
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'audio/mpeg') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError("Veuillez sélectionner un fichier MP3 valide.")
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'audio/mpeg') {
      setFile(droppedFile)
      setError(null)
    } else {
      setError("Veuillez déposer un fichier MP3 valide.")
    }
  }

  const analyzeCall = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    setError(null)

    // Simulate progress while waiting for webhook
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 5
      })
    }, 400)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(import.meta.env.VITE_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error("L'analyse a échoué. Veuillez réessayer.")

      let data = await response.json()
      console.log("Webhook response original:", data)

      // Handle common n8n/LangChain response formats:
      // 1. Array wrapper: [ { ... } ]
      if (Array.isArray(data)) {
        data = data[0]
      }
      
      // 2. Nested output property: { output: { ... } }
      if (data && data.output && typeof data.output === 'object') {
        data = data.output
      }

      console.log("Webhook response parsed:", data)
      
      // Ensure we have at least one of the expected keys
      if (!data.satisfaction_client && !data.accueil_collaborateur && !data.qualite_reponses && !data.ton_collaborateur) {
        throw new Error("L'IA a renvoyé un format inattendu. Vérifiez les logs console.")
      }

      setResult(data)
      setProgress(100)
    } catch (err) {
      setError(err.message)
      clearInterval(interval)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addToDatabase = async () => {
    if (!result) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('calls')
        .insert([{
          satisfaction_client: result.satisfaction_client,
          qualite_reponses: result.qualite_reponses,
          ton_collaborateur: result.ton_collaborateur,
          accueil_collaborateur: result.accueil_collaborateur,
          summary: result.summary,
          poste: "Analyse IA", // Mandatory field
          duration_seconds: 0,   // Mandatory field
          // created_at is handled by Supabase default now()
        }])

      if (error) throw error
      
      // Success - show feedback or clear
      setFile(null)
      setResult(null)
      setProgress(0)
      alert("Appel ajouté avec succès à la base de données !")
    } catch (err) {
      setError("Erreur lors de l'ajout à la base de données : " + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const getScoreColor = (score) => {
    const s = parseInt(score)
    if (s >= 5) return 'text-indigo-600'
    if (s >= 4) return 'text-emerald-600'
    if (s >= 3) return 'text-amber-500'
    if (s >= 2) return 'text-orange-500'
    if (s >= 1) return 'text-red-500'
    return 'text-slate-400'
  }

  const getLoadingMessage = (p) => {
    if (p < 20) return "Initialisation de l'analyse..."
    if (p < 40) return "Transcription de l'enregistrement..."
    if (p < 60) return "Analyse du ton et de l'ambiance..."
    if (p < 80) return "Évaluation de la qualité des réponses..."
    if (p < 95) return "Calcul de la satisfaction client..."
    return "Finalisation du rapport..."
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">Analyser un Appel</h1>
        <p className="text-muted-foreground mt-1 font-medium">Téléchargez un enregistrement pour une analyse IA instantanée.</p>
      </div>

      {!result && (
        <div 
          className={cn(
            "relative group overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300",
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50",
            isAnalyzing && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="audio/mpeg"
            onChange={handleFileChange}
          />
          
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            {file ? (
              <>
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary animate-bounce-subtle">
                  <FileAudio size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB • Prêt pour l'analyse</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                  <Upload size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Cliquez ou déposez votre fichier MP3</h3>
                  <p className="text-sm text-muted-foreground mt-1">Format supporté : MP3 uniquement</p>
                </div>
              </>
            )}
          </div>

          {/* Decorative background pulse */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {file && !result && (
        <div className="flex flex-col items-center gap-4">
          {!isAnalyzing ? (
            <div className="flex gap-3">
              <button 
                onClick={reset}
                className="px-6 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2"
              >
                <Trash2 size={18} />
                Annuler
              </button>
              <button 
                onClick={analyzeCall}
                className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <Send size={18} />
                Lancer l'analyse
              </button>
            </div>
          ) : (
            <div className="w-full space-y-6 max-w-md animate-in fade-in duration-700">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-16 h-16 flex items-center justify-center">
                   <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                   <div 
                     className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                     style={{ borderTopColor: 'transparent' }}
                   ></div>
                   <Mic size={24} className="text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-slate-900 tabular-nums">
                    {Math.round(progress)}%
                  </span>
                  <p className="text-primary font-semibold text-sm h-5 transition-all duration-500 animate-pulse">
                    {getLoadingMessage(progress)}
                  </p>
                </div>
              </div>

              <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500 ease-out shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                  style={{ width: `${progress}%` }}
                />
                {/* Visual highlight on the bar */}
                <div 
                  className="absolute top-0 bottom-0 w-8 bg-white/30 skew-x-[-20deg] animate-shimmer"
                  style={{ left: `${progress - 5}%` }}
                />
              </div>
              
              <div className="flex justify-between px-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Upload</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Analyse IA</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rapport</span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <XCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Satisfaction", key: "satisfaction_client" },
              { label: "Qualité", key: "qualite_reponses" },
              { label: "Ton", key: "ton_collaborateur" },
              { label: "Accueil", key: "accueil_collaborateur" }
            ].map((score) => (
              <div key={score.key} className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center space-y-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{score.label}</span>
                <span className={cn("text-3xl font-black transition-colors duration-500", getScoreColor(result[score.key]))}>
                  {result[score.key] || 0}/5
                </span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Mic size={24} className="text-primary" />
                Confirmation de l'analyse
              </h3>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                Prêt à enregistrer
              </div>
            </div>

            {result.summary && (
              <div className="p-4 rounded-xl bg-secondary/50 border border-border italic text-sm text-slate-700 leading-relaxed">
                <span className="font-bold block mb-1 not-italic text-xs uppercase text-muted-foreground tracking-widest">Résumé de l'appel :</span>
                "{result.summary}"
              </div>
            )}

            <p className="text-muted-foreground text-sm">
              L'IA a terminé l'évaluation des indicateurs. Vous pouvez maintenant ajouter ces résultats à votre base de données ou relancer une analyse.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={addToDatabase}
                disabled={isSaving}
                className="flex-1 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Database size={20} />
                )}
                Ajouter à la base de données
              </button>
              <button 
                onClick={reset}
                className="px-8 py-3 rounded-2xl border border-border font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Trash2 size={20} />
                Nouvelle analyse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
