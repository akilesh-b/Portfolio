import type { ArticleArt as Kind } from '../../data/articles'

/** Generated cover artwork for article cards (no stock photos needed). */
export function ArticleArt({ kind }: { kind: Kind }) {
  if (kind === 'journey') {
    return (
      <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1f17" />
            <stop offset="1" stopColor="#0b0c0b" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#sky)" />
        <path d="M0 190 L70 120 L110 150 L180 70 L250 140 L300 100 L400 170 L400 240 L0 240Z" fill="#dfff4f" opacity=".08" />
        <path d="M0 210 L90 160 L150 190 L230 130 L310 180 L400 150 L400 240 L0 240Z" fill="#dfff4f" opacity=".14" />
        <path d="M40 225 C 120 210, 110 170, 190 160 S 260 110, 300 85" fill="none" stroke="#dfff4f" strokeWidth="1.5" strokeDasharray="4 5" className="dash-flow" />
        {[
          [40, 225],
          [190, 160],
          [300, 85],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 2 ? 6 : 4} fill={i === 2 ? '#dfff4f' : '#0b0c0b'} stroke="#dfff4f" strokeWidth="1.5" />
        ))}
        <text x="310" y="70" fill="#F4F4EF" fillOpacity=".6" fontSize="10" fontFamily="JetBrains Mono, monospace">
          AI ENGINEER
        </text>
      </svg>
    )
  }
  if (kind === 'rag') {
    return (
      <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="400" height="240" fill="#0c0e0c" />
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={(i * 53) % 400} cy={(i * 97) % 240} r={i % 7 === 0 ? 2 : 1} fill={i % 7 === 0 ? '#dfff4f' : '#F4F4EF'} opacity={i % 7 === 0 ? 0.8 : 0.18} />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${70 + i * 14} ${60 + i * 12})`}>
            <rect width="100" height="128" rx="8" fill="#161a15" stroke="#F4F4EF" strokeOpacity=".15" />
            {[18, 30, 42, 54].map((y) => (
              <rect key={y} x="14" y={y} width={y === 54 ? 40 : 72} height="4" rx="2" fill="#F4F4EF" opacity=".15" />
            ))}
          </g>
        ))}
        <circle cx="290" cy="120" r="54" fill="none" stroke="#dfff4f" strokeWidth="6" opacity=".9" />
        <circle cx="290" cy="120" r="54" fill="none" stroke="#dfff4f" strokeWidth="22" opacity=".12" />
        <path d="M200 130 C 225 130, 225 120, 236 120" stroke="#dfff4f" strokeWidth="1.2" fill="none" strokeDasharray="3 4" className="dash-flow" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="400" height="240" fill="#101310" />
      <rect x="50" y="40" width="300" height="170" rx="12" fill="#0a0b0a" stroke="#F4F4EF" strokeOpacity=".14" />
      <circle cx="68" cy="56" r="3.5" fill="#F4F4EF" opacity=".2" />
      <circle cx="80" cy="56" r="3.5" fill="#F4F4EF" opacity=".2" />
      <circle cx="92" cy="56" r="3.5" fill="#dfff4f" opacity=".8" />
      {[
        ['$', 'ollama run qwen2.5-coder', 88],
        ['$', 'docker compose up -d', 108],
        ['$', 'git push origin main', 128],
        ['✓', 'build passed', 148],
      ].map(([p, t, y]) => (
        <text key={t as string} x="70" y={y as number} fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#F4F4EF" fillOpacity=".7">
          <tspan fill="#dfff4f">{p}</tspan> {t}
        </text>
      ))}
      <rect x="70" y="160" width="8" height="13" fill="#dfff4f" className="caret" />
    </svg>
  )
}
