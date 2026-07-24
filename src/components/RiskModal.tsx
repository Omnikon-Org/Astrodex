"use client"

import { useAppState } from "@/lib/store"

export function RiskModal() {
  const { showRiskModal, dismissRiskModal, conjunctions } = useAppState()

  if (!showRiskModal) return null

  // Find the high risk conjunctions
  const highRiskConjunctions = conjunctions.filter((c) => c.risk === "HIGH")
  
  if (highRiskConjunctions.length === 0) {
    // If modal is open but no high risk, auto-dismiss
    setTimeout(dismissRiskModal, 0)
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-2 border-red-500 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.4)] max-w-lg w-full overflow-hidden flex flex-col">
        <div className="bg-red-950/80 px-6 py-4 flex items-center gap-3 border-b border-red-500/50">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-400 tracking-wider">COLLISION WARNING</h2>
            <div className="text-xs text-red-300/70 font-mono">CRITICAL PROXIMITY ALERT</div>
          </div>
        </div>
        
        <div className="p-6 text-slate-300 font-mono text-sm space-y-4">
          <p>Immediate attention required. The following objects have breached the minimum safe distance threshold:</p>
          
          <div className="bg-black/50 border border-slate-700 rounded overflow-y-auto max-h-48 p-2">
            {highRiskConjunctions.map((c) => (
              <div key={c.id} className="flex justify-between items-center py-2 px-3 hover:bg-slate-800/50 rounded">
                <div>
                  <span className="text-red-400 font-bold">{c.satelliteName}</span>
                  <span className="mx-2 text-slate-500">vs</span>
                  <span className="text-amber-400">{c.secondaryName}</span>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold">{c.missKm} km</div>
                  <div className="text-xs text-slate-500">{c.tca}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Suggest immediate orbital maneuver to increase altitude and avoid collision.
            Select the satellite in the Right Sidebar and utilize the Δv thrusters.
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-950 flex justify-end gap-3 border-t border-slate-800">
          <button
            onClick={dismissRiskModal}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold tracking-wider rounded transition-colors uppercase text-sm"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  )
}
