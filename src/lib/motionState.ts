/**
 * Tiny mutable stores shared between DOM animation code and the WebGL /
 * canvas render loops. Plain objects on purpose: they are read every frame
 * and must never trigger React renders.
 */

/** Pointer position normalised to -1…1 (smoothed by the readers). */
export const pointer = { x: 0, y: 0, active: false }

/** Hero scroll-out progress 0…1, written by the hero ScrollTrigger. */
export const heroScroll = { progress: 0 }

let bound = false
export function bindPointer() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.active = true
    },
    { passive: true },
  )
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
