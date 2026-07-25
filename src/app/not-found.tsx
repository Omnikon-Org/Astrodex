import Link from "next/link"

const STAR_POSITIONS = [
  { top: "18%", left: "12%", size: "3px", opacity: 0.55 },
  { top: "28%", left: "78%", size: "2px", opacity: 0.45 },
  { top: "44%", left: "20%", size: "2px", opacity: 0.35 },
  { top: "62%", left: "82%", size: "3px", opacity: 0.5 },
  { top: "72%", left: "14%", size: "2px", opacity: 0.4 },
] as const

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "var(--bg-deep)", color: "var(--text-primary)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 34%), radial-gradient(circle at bottom, rgba(56, 189, 248, 0.06), transparent 24%)",
          }}
        />

        {STAR_POSITIONS.map((star, index) => (
          <span
            key={`${star.top}-${star.left}-${index}`}
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              background: "var(--accent-cyan)",
              boxShadow: "0 0 10px rgba(56, 189, 248, 0.35)",
            }}
          />
        ))}
      </div>

      <section
        className="relative z-10 w-full max-w-xl rounded-[var(--radius-xl)] border px-6 py-10 text-center shadow-2xl sm:px-10 sm:py-12"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--glass-border)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
        }}
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-6 h-2 w-24 rounded-full"
          style={{ background: "var(--accent-cyan)", boxShadow: "0 0 18px rgba(56, 189, 248, 0.35)" }}
        />

        <p
          className="mb-3 font-mono text-xs uppercase tracking-[0.35em]"
          style={{ color: "var(--text-muted)" }}
        >
          Navigation Error
        </p>

        <h1 className="text-7xl font-bold tracking-[0.18em] sm:text-8xl" style={{ color: "var(--text-primary)" }}>
          404
        </h1>

        <p className="mt-6 text-xl font-semibold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
          This orbit does not exist.
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 sm:text-base" style={{ color: "var(--text-secondary)" }}>
          The page or route you requested could not be found.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-[var(--radius-md)] border px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[rgba(56,189,248,0.12)]"
          style={{
            borderColor: "var(--glass-border)",
            color: "var(--accent-cyan)",
            background: "var(--accent-cyan-dim)",
          }}
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  )
}