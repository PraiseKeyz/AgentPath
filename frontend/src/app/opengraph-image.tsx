import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const logoSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
    <circle cx="12" cy="40" r="3.5" fill="white"/>
    <path d="M12 40 C 12 26, 36 34, 36 20" stroke="white" stroke-width="5" stroke-linecap="round"/>
    <circle cx="36" cy="11.5" r="5" stroke="white" stroke-width="4.5"/>
  </svg>`,
)

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B1120',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top blue gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: 'linear-gradient(90deg, #0075DE 0%, #62AEF0 60%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Subtle radial glow behind logo area */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,117,222,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Logo + brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img
            src={`data:image/svg+xml;charset=utf-8,${logoSvg}`}
            width={52}
            height={52}
            alt=""
          />
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '30px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
            }}
          >
            AgentPath
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            gap: '0px',
          }}
        >
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '76px',
              fontWeight: '800',
              lineHeight: 1.05,
              letterSpacing: '-3px',
              display: 'flex',
            }}
          >
            Your AI mentor.
          </div>
          <div
            style={{
              color: '#62AEF0',
              fontSize: '76px',
              fontWeight: '800',
              lineHeight: 1.05,
              letterSpacing: '-3px',
              display: 'flex',
            }}
          >
            Your path forward.
          </div>
        </div>

        {/* Tagline + JAF credit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '36px',
          }}
        >
          <div
            style={{
              color: '#787774',
              fontSize: '22px',
              fontWeight: '400',
              letterSpacing: '-0.2px',
              display: 'flex',
            }}
          >
            AI-powered mentorship for first-generation Nigerian university students
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0,117,222,0.12)',
              border: '1px solid rgba(98,174,240,0.2)',
              borderRadius: '999px',
              padding: '8px 20px',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#0075DE',
                display: 'flex',
              }}
            />
            <span style={{ color: '#62AEF0', fontSize: '17px', fontWeight: '600', display: 'flex' }}>
              JAF Initiative
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
