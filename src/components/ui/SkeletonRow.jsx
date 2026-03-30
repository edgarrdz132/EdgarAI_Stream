import React from 'react'

export default function SkeletonRow({ label }) {
  return (
    <section style={{ padding: '0 0 8px', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 48px', marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 180, height: 28, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 6 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, padding: '8px 48px 20px', overflow: 'hidden' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ flexShrink: 0, width: 220 }}>
            <div className="skeleton" style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, marginBottom: 10 }} />
            <div className="skeleton" style={{ width: '75%', height: 14, borderRadius: 4, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: '45%', height: 11, borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </section>
  )
}
