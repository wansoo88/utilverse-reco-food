import { ImageResponse } from 'next/og';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #fef6f1 0%, #ffffff 45%, #faedcb 100%)',
          padding: '64px',
          color: '#1a1a19',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: '#dc5f2f', letterSpacing: '0.04em' }}>AI FOOD GUIDE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.02em' }}>{SITE_NAME}</div>
          <div style={{ fontSize: 32, lineHeight: 1.4, maxWidth: '88%', color: '#3f3e3b' }}>{SITE_DESCRIPTION}</div>
        </div>
        <div style={{ fontSize: 24, color: '#75736a' }}>{new URL(SITE_URL).host}</div>
      </div>
    ),
    size,
  );
}
