"use client"

import { useAppState } from "@/lib/store"

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { claimedAsteroids, claimHistory } = useAppState()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-[400px] bg-[#0a101c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-sky-400/10 to-transparent flex justify-between items-center">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white/90">User Profile</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/90">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-sky-400/20 border-2 border-sky-400/50 flex items-center justify-center text-xl text-sky-400 font-bold">
              C
            </div>
            <div>
              <h3 className="text-lg font-bold text-white/90">
                Commander
              </h3>
              <p className="text-xs text-white/50">agent@omnikon.org</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono text-emerald-400">{claimedAsteroids.size}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mt-1">Active Claims</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono text-sky-400">{claimHistory.length}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mt-1">Total Actions</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 border-b border-white/10 pb-2">Recent Activity</h4>
            <div className="max-h-[120px] overflow-y-auto pr-2 flex flex-col gap-2 mt-1">
              {claimHistory.length > 0 ? (
                claimHistory.slice(-10).reverse().map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-white/80">{h.action} AST-{h.id.toString().padStart(4, "0")}</span>
                    <span className="text-white/40 font-mono">{h.timestamp.toLocaleTimeString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-white/40 italic">No activity yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
