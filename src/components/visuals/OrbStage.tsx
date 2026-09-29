import { lazy, Suspense, useMemo, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { hasWebGL } from '../../lib/motionState'
import OrbFallback from './OrbFallback'

// Three.js is only downloaded when a WebGL scene is actually shown.
const OrbScene = lazy(() => import('./OrbScene'))

interface Props {
  variant: 'hero' | 'planet'
  className?: string
  /** Delay mounting (e.g. until the loader finishes). */
  enabled?: boolean
}

/**
 * Chooses the right renderer for the orbital visual:
 * desktop + WebGL → Three.js scene; otherwise → 2D canvas fallback.
 * Render loops pause while the stage is off-screen.
 */
export function OrbStage({ variant, className, enabled = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, '100px')
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const webgl = useMemo(() => hasWebGL(), [])

  const use3D = enabled && isDesktop && webgl && !reduced
  const fallback = <OrbFallback variant={variant} active={inView && !reduced} still={reduced} />

  return (
    <div ref={ref} className={className} aria-hidden>
      {enabled &&
        (use3D ? (
          <Suspense fallback={fallback}>
            <OrbScene variant={variant} lowPower={false} active={inView} />
          </Suspense>
        ) : (
          fallback
        ))}
    </div>
  )
}
