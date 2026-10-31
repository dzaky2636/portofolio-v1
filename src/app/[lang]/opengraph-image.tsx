import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getDictionary } from '@/lib/getDictionary';

export const alt = 'Dzaky Fatur Rahman — Lead Fullstack Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#0C0C0C';
const PAPER = '#F4F3ED';
const BLUE = '#2945FF';

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const root = process.cwd();
  const [serif, mono, photo] = await Promise.all([
    readFile(join(root, 'src/assets/fonts/InstrumentSerif-Regular.ttf')),
    readFile(join(root, 'src/assets/fonts/JetBrainsMono-Medium.ttf')),
    readFile(join(root, 'public/images/profile-pic.jpg')),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: 48,
        backgroundColor: PAPER,
        border: `12px solid ${INK}`,
        color: INK,
        fontFamily: 'Instrument Serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 112, lineHeight: 0.9 }}>
            <span>DZAKY FATUR</span>
            <span>RAHMAN</span>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              padding: '10px 18px',
              backgroundColor: INK,
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              letterSpacing: 3,
              textTransform: 'uppercase',
              boxShadow: `6px 6px 0px ${BLUE}`,
            }}
          >
            {dict.hero.title}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            {dict.inventory.proof.items.slice(0, 3).map((item) => (
              <div
                key={item.label}
                style={{ display: 'flex', flexDirection: 'column', width: 230, paddingRight: 16 }}
              >
                <span style={{ fontSize: 64, lineHeight: 1 }}>{item.value}</span>
                <span
                  style={{
                    marginTop: 6,
                    fontFamily: 'JetBrains Mono',
                    fontSize: 14,
                    letterSpacing: 1,
                    lineHeight: 1.3,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              color: BLUE,
              fontFamily: 'JetBrains Mono',
              fontSize: 20,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            dzakyfatur.my.id
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          width: 356,
          border: `6px solid ${INK}`,
          backgroundColor: '#FFFFFF',
          boxShadow: `12px 12px 0px ${INK}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: `6px solid ${INK}`,
            backgroundColor: PAPER,
            fontFamily: 'JetBrains Mono',
            fontSize: 15,
            letterSpacing: 1,
          }}
        >
          <span>{dict.hero.profileFrameTitle}</span>
          <span style={{ color: BLUE }}>{dict.hero.profileFrameStatus}</span>
        </div>
        <img
          src={photoSrc}
          width={344}
          height={344}
          alt=""
          style={{ display: 'flex', filter: 'grayscale(1)' }}
        />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
      ],
    }
  );
}
