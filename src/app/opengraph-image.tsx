import { ImageResponse } from 'next/og'

import { siteConfig } from '@/content/site'

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Server-rendered Open Graph card. Rendered at build time on the edge, so it
 * costs nothing at request time.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0e0e14',
          backgroundImage:
            'radial-gradient(circle at 78% 32%, rgba(139,92,246,0.45) 0%, transparent 55%), radial-gradient(circle at 12% 88%, rgba(45,212,167,0.22) 0%, transparent 50%)',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg,#8b5cf6,#2dd4a7)',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0e0e14',
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div style={{ display: 'flex', color: '#f5f5f4', fontSize: 30, fontWeight: 600 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              color: '#fafaf9',
              letterSpacing: '-0.03em',
            }}
          >
            Builds weird and useful stuff.
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#a1a1aa' }}>
            Full-stack Engineer &amp; Product Designer
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 20,
            fontSize: 22,
            color: '#a1a1aa',
            letterSpacing: '0.18em',
          }}
        >
          {siteConfig.location.toUpperCase()}
          <span style={{ color: '#ff6b4a' }}>·</span>
          <span style={{ color: '#2dd4a7' }}>AVAILABLE FOR SELECT WORK</span>
        </div>
      </div>
    ),
    size,
  )
}
