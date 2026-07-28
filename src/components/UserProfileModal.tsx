function IconUser({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconX({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 glass-panel animate-fade-in-up border-t border-[var(--glass-border)] shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-cyan)]/10 rounded-full">
              <IconUser size={24} className="text-[var(--accent-cyan)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-white/5"
            aria-label="Close modal"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)] text-sm">Clearance Level</span>
            <span className="text-[var(--text-primary)] font-mono font-medium">GUEST_01</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)] text-sm">System Access</span>
            <span className="text-[var(--text-primary)] font-mono font-medium">Read-Only</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-secondary)] text-sm">Session Time</span>
            <span className="text-[var(--accent-green)] font-mono font-medium animate-pulse">Active</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8">
          <button
            className="w-full py-2.5 bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 text-[var(--accent-cyan)] rounded font-semibold tracking-wider transition-colors"
            onClick={onClose}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  )
}
