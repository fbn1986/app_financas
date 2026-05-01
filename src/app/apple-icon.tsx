import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          borderRadius: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {/* Gráfico estilizado */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, marginBottom: 4 }}>
          {[40, 60, 45, 80, 55, 95].map((h, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: h * 0.55,
                background: 'rgba(255,255,255,0.85)',
                borderRadius: 3,
              }}
            />
          ))}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            letterSpacing: 1,
          }}
        >
          FinançasPRO
        </div>
      </div>
    ),
    { ...size }
  )
}
