import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

export const alt = 'PantryMate 링크 공유 이미지';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const character = await readFile(
    path.join(process.cwd(), 'public/images/metadata/pantry-mate-character.png'),
  );
  const characterSrc = `data:image/png;base64,${character.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#f7f7f5',
        display: 'flex',
        height: '100%',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '72px 80px',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          background: '#66ad5c',
          borderRadius: 999,
          height: 420,
          opacity: 0.12,
          position: 'absolute',
          right: -72,
          top: -136,
          width: 420,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          position: 'relative',
          width: 560,
        }}
      >
        <div
          style={{
            color: '#66ad5c',
            display: 'flex',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          SMART PANTRY
        </div>
        <div
          style={{
            color: '#242424',
            display: 'flex',
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          PantryMate
        </div>
      </div>
      <img
        alt=""
        height={430}
        src={characterSrc}
        style={{ objectFit: 'contain', position: 'relative' }}
        width={475}
      />
    </div>,
    size,
  );
}
