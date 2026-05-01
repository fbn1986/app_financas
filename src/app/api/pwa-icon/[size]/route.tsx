import { ImageResponse } from 'next/og'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeStr } = await params
  const size = Math.min(Math.max(Number(sizeStr) || 192, 32), 512)
  const radius = Math.round(size * 0.18)
  const barHeights = [0.32, 0.48, 0.38, 0.65, 0.44, 0.78]
  const barWidth = Math.round(size * 0.07)
  const gap = Math.round(size * 0.035)
  const chartBottom = Math.round(size * 0.6)
  const maxBarH = Math.round(size * 0.35)
  const fontSize = Math.round(size * 0.16)
  const labelSize = Math.round(size * 0.11)

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
          borderRadius: radius,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Math.round(size * 0.04),
        }}
      >
        {/* Barras do gráfico */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap,
          }}
        >
          {barHeights.map((h, i) => (
            <div
              key={i}
              style={{
                width: barWidth,
                height: Math.round(h * maxBarH),
                background: 'rgba(255,255,255,0.85)',
                borderRadius: Math.round(barWidth * 0.35),
              }}
            />
          ))}
        </div>
        {/* Nome do app */}
        <div
          style={{
            color: 'white',
            fontSize,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            letterSpacing: Math.round(size * 0.005),
          }}
        >
          FinançasPRO
        </div>
      </div>
    ),
    { width: size, height: size }
  )
}
