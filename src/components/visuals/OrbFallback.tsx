import { useEffect, useRef } from 'react'
import { heroScroll, pointer } from '../../lib/motionState'

interface Props {
  variant: 'hero' | 'planet'
  active: boolean
  /** Draw a single static frame (reduced motion). */
  still?: boolean
}

/**
 * Lightweight 2D-canvas version of the orbital visual. Used on mobile, when
 * WebGL is unavailable, and for reduced-motion users.
 */
export default function OrbFallback({ variant, active, still }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const N = variant === 'hero' ? 260 : 320
    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts: [number, number, number][] = []
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      pts.push([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r])
    }
    const dust = Array.from({ length: 60 }, () => ({ a: Math.random() * Math.PI * 2, r: 1.5 + Math.random() * 1.4, s: 0.1 + Math.random() * 0.3, z: Math.random() }))

    const ink = '236,238,228'
    const acc = '223,255,79'
    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio, 1.75)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const ring = (cx: number, cy: number, rx: number, ry: number, rot: number, alpha: number, color: string) => {
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${color},${alpha})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.26
      const spread = 1 + heroScroll.progress * 0.6
      const rotY = t * 0.00018 + pointer.x * 0.4
      const rotX = 0.25 + pointer.y * 0.15

      // glow
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.6)
      g.addColorStop(0, `rgba(${acc},0.16)`)
      g.addColorStop(1, `rgba(${acc},0)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // rings
      ctx.save()
      ctx.shadowColor = `rgba(${acc},0.9)`
      ctx.shadowBlur = 14
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.ellipse(cx, cy, R * 1.55 * spread, R * 0.42 * spread, -0.28, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${acc},0.85)`
      ctx.stroke()
      ctx.restore()
      ring(cx, cy, R * 1.85 * spread, R * 0.62 * spread, 0.35, 0.14, ink)
      const sa = t * 0.0005
      ctx.fillStyle = `rgba(${acc},0.95)`
      ctx.beginPath()
      const sx = Math.cos(sa) * R * 1.55 * spread
      const sy = Math.sin(sa) * R * 0.42 * spread
      ctx.arc(cx + sx * Math.cos(-0.28) - sy * Math.sin(-0.28), cy + sx * Math.sin(-0.28) + sy * Math.cos(-0.28), 2.4, 0, Math.PI * 2)
      ctx.fill()

      // sphere points
      const cY = Math.cos(rotY)
      const sY = Math.sin(rotY)
      const cX = Math.cos(rotX)
      const sX = Math.sin(rotX)
      for (let i = 0; i < pts.length; i++) {
        const [x, y, z] = pts[i]
        const x1 = x * cY - z * sY
        const z1 = x * sY + z * cY
        const y1 = y * cX - z1 * sX
        const z2 = y * sX + z1 * cX
        const depth = (z2 + 1) / 2
        const a = 0.12 + depth * 0.7
        ctx.fillStyle = i % 9 === 0 ? `rgba(${acc},${a})` : `rgba(${ink},${a * 0.8})`
        ctx.beginPath()
        ctx.arc(cx + x1 * R, cy + y1 * R, 0.6 + depth * 1.1, 0, Math.PI * 2)
        ctx.fill()
      }

      // drifting dust
      for (const d of dust) {
        const a = d.a + t * 0.00005 * d.s * 10
        const r = d.r * R * spread
        ctx.fillStyle = `rgba(${ink},${0.15 + d.z * 0.35})`
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6, 0.8 + d.z, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (still) {
      draw(0)
    } else if (active) {
      const loop = (t: number) => {
        draw(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    } else {
      draw(performance.now())
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [variant, active, still])

  return <canvas ref={ref} className="h-full w-full" aria-hidden />
}
