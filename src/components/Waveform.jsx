import { useMemo } from 'react'

export default function Waveform({ count = 34, minH = 14, maxH = 90, small = false }) {
  const bars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        h: small
          ? Math.floor(Math.random() * 22) + 8
          : Math.floor(Math.random() * (maxH - minH)) + minH,
        delay: i * (small ? 0.07 : 0.06),
      })),
    [count, minH, maxH, small]
  )

  return (
    <div className={small ? 'flex items-end justify-center gap-[3px] h-[30px]' : 'flex items-end justify-center gap-1 h-[120px]'}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={small ? 'wave-bar-sm' : 'wave-bar'}
          style={{ '--h': `${bar.h + (small ? 14 : 0)}px`, animationDelay: `${bar.delay}s`, height: small ? `${bar.h}px` : undefined }}
        />
      ))}
    </div>
  )
}
