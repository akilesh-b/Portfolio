import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { heroScroll, pointer } from '../../lib/motionState'

export type OrbVariant = 'hero' | 'planet'

interface SceneProps {
  variant: OrbVariant
  lowPower: boolean
}

const LIME = new THREE.Color('#DFFF4F')

/* ---------------- shaders ---------------- */

const pointVert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  uniform float uSpread;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec3 p = position * (1.0 + uSpread * (0.6 + aSeed));
    p += 0.035 * vec3(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 23.0), sin(uTime * 0.5 + aSeed * 11.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixel * (4.0 / -mv.z);
    vAlpha = smoothstep(9.0, 2.5, -mv.z);
    vSeed = aSeed;
  }
`
const pointFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, step(0.86, vSeed));
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  }
`

const rimVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const rimFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), uPower);
    gl_FragColor = vec4(uColor, f * uOpacity);
  }
`

/* ---------------- geometry helpers ---------------- */

function randomShell(n: number, rMin: number, rMax: number) {
  const pts = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1
    const th = Math.random() * Math.PI * 2
    const r = rMin + Math.random() * (rMax - rMin)
    const s = Math.sqrt(1 - u * u)
    pts[i * 3] = s * Math.cos(th) * r
    pts[i * 3 + 1] = u * r
    pts[i * 3 + 2] = s * Math.sin(th) * r
  }
  return pts
}

function useParticleMaterial(colorA: THREE.Color, colorB: THREE.Color, opacity: number, additive: boolean) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVert,
        fragmentShader: pointFrag,
        transparent: true,
        depthWrite: false,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixel: { value: Math.min(window.devicePixelRatio, 1.5) },
          uSpread: { value: 0 },
          uColorA: { value: colorA },
          uColorB: { value: colorB },
          uOpacity: { value: opacity },
        },
      }),
    [colorA, colorB, opacity, additive],
  )
}

function Particles({ positions, sizeRange, material }: { positions: Float32Array; sizeRange: [number, number]; material: THREE.ShaderMaterial }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const n = positions.length / 3
    const sizes = new Float32Array(n)
    const seeds = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
      seeds[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return g
  }, [positions, sizeRange])
  return <points geometry={geo} material={material} />
}

/** Thin line segments linking nearby nodes — the "network" layer. */
function Connections({ nodes, maxDist, color, opacity }: { nodes: Float32Array; maxDist: number; color: THREE.Color; opacity: number }) {
  const geo = useMemo(() => {
    const segs: number[] = []
    const n = nodes.length / 3
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = nodes[i * 3] - nodes[j * 3]
        const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1]
        const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
          segs.push(nodes[i * 3], nodes[i * 3 + 1], nodes[i * 3 + 2], nodes[j * 3], nodes[j * 3 + 1], nodes[j * 3 + 2])
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3))
    return g
  }, [nodes, maxDist])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  )
}

function OrbitRing({ radius, tilt, color, opacity, speed, dashed = false }: { radius: number; tilt: [number, number, number]; color: THREE.Color; opacity: number; speed: number; dashed?: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const sat = useRef<THREE.Mesh>(null)
  const line = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0)
    const pts = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y))
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    const m = dashed
      ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.06, gapSize: 0.05, depthWrite: false })
      : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
    const l = new THREE.Line(g, m)
    if (dashed) l.computeLineDistances()
    return l
  }, [radius, color, opacity, dashed])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed * 0.2
    if (sat.current) {
      const t = performance.now() * 0.0004 * speed
      sat.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius)
    }
  })

  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <primitive object={line} />
        <mesh ref={sat}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  )
}

function RimSphere({ radius, color, power, opacity, additive }: { radius: number; color: THREE.Color; power: number; opacity: number; additive: boolean }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: rimVert,
        fragmentShader: rimFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        uniforms: { uColor: { value: color }, uPower: { value: power }, uOpacity: { value: opacity } },
      }),
    [color, power, opacity, additive],
  )
  return (
    <mesh material={mat}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  )
}

/* ---------------- scenes ---------------- */

/** Lat/long dot globe with pseudo-continents (cheap trig noise). */
function globePoints(lowPower: boolean, radius: number) {
  const pts: number[] = []
  const rows = lowPower ? 40 : 70
  for (let i = 1; i < rows; i++) {
    const lat = (i / rows) * Math.PI
    const ring = Math.max(6, Math.floor(Math.sin(lat) * rows * 2))
    for (let j = 0; j < ring; j++) {
      const lon = (j / ring) * Math.PI * 2
      const n = Math.sin(lon * 3.0 + Math.cos(lat * 4.0) * 1.5) * Math.cos(lat * 3.0 - lon * 0.7) + 0.35 * Math.sin(lon * 7.0 + lat * 5.0)
      if (n < 0.1) continue
      pts.push(Math.sin(lat) * Math.cos(lon) * radius, Math.cos(lat) * radius, Math.sin(lat) * Math.sin(lon) * radius)
    }
  }
  return new Float32Array(pts)
}

/** Bright lime orbit: a thin core torus plus two soft additive halos. */
function GlowRing({ radius, tilt, speed }: { radius: number; tilt: [number, number, number]; speed: number }) {
  const spin = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.z += dt * speed
  })
  const halo = (tube: number, opacity: number) => (
    <mesh>
      <torusGeometry args={[radius, tube, 12, 220]} />
      <meshBasicMaterial color={LIME} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
  return (
    <group rotation={tilt}>
      <group ref={spin}>
        {halo(0.008, 1)}
        {halo(0.03, 0.25)}
        {halo(0.09, 0.07)}
        {/* travelling flare */}
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#F6FFD0" />
        </mesh>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

function HeroOrb({ lowPower }: Omit<SceneProps, 'variant'>) {
  const globe = useRef<THREE.Group>(null)
  const orbits = useRef<THREE.Group>(null)
  const base = useMemo(() => new THREE.Color('#E8EAE0'), [])
  const accent = LIME

  const land = useMemo(() => globePoints(lowPower, 1.62), [lowPower])
  const nodes = useMemo(() => randomShell(lowPower ? 40 : 70, 1.75, 2.05), [lowPower])
  const dust = useMemo(() => randomShell(lowPower ? 250 : 500, 2.3, 5.5), [lowPower])

  const landMat = useParticleMaterial(base, accent, 0.7, true)
  const nodeMat = useParticleMaterial(accent, base, 0.9, true)
  const dustMat = useParticleMaterial(accent, base, 0.55, true)

  const smooth = useRef({ x: 0, y: 0, p: 0 })

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const s = smooth.current
    s.x += (pointer.x - s.x) * Math.min(dt * 2.5, 1)
    s.y += (pointer.y - s.y) * Math.min(dt * 2.5, 1)
    s.p += (heroScroll.progress - s.p) * Math.min(dt * 5, 1)

    for (const m of [landMat, nodeMat, dustMat]) m.uniforms.uTime.value = t
    dustMat.uniforms.uSpread.value = s.p * 1.4

    if (globe.current) {
      globe.current.rotation.y = t * 0.07 + s.x * 0.4
      globe.current.rotation.x = 0.3 + s.y * 0.2
    }
    if (orbits.current) {
      orbits.current.scale.setScalar(1 + s.p * 0.8)
      orbits.current.rotation.y = s.x * 0.15
      orbits.current.rotation.x = -s.y * 0.1
    }
  })

  return (
    <>
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[1.6, 64, 64]} />
          <meshBasicMaterial color="#0a0c0a" transparent opacity={0.94} />
        </mesh>
        <Particles positions={land} sizeRange={[1.4, 2.6]} material={landMat} />
        <Particles positions={nodes} sizeRange={[2, 3.4]} material={nodeMat} />
        <Connections nodes={nodes} maxDist={0.7} color={base} opacity={0.12} />
      </group>
      <RimSphere radius={1.74} color={accent} power={2.8} opacity={0.75} additive />
      <group ref={orbits}>
        <GlowRing radius={2.25} tilt={[1.15, -0.35, 0.5]} speed={0.35} />
        <GlowRing radius={2.55} tilt={[1.35, 0.4, -0.3]} speed={-0.22} />
        <OrbitRing radius={3.0} tilt={[1.25, 0.1, 0.8]} color={base} opacity={0.12} speed={0.3} dashed />
      </group>
      <Particles positions={dust} sizeRange={[0.6, 1.6]} material={dustMat} />
    </>
  )
}

function PlanetOrb({ lowPower }: Omit<SceneProps, 'variant'>) {
  const planet = useRef<THREE.Group>(null)
  const accent = LIME
  const base = useMemo(() => new THREE.Color('#E8EAE0'), [])
  const additive = true

  const globe = useMemo(() => globePoints(lowPower, 1.6), [lowPower])
  const dust = useMemo(() => randomShell(lowPower ? 150 : 320, 2.1, 4.2), [lowPower])

  const globeMat = useParticleMaterial(base, accent, 0.8, additive)
  const dustMat = useParticleMaterial(accent, base, 0.55, additive)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    globeMat.uniforms.uTime.value = t
    dustMat.uniforms.uTime.value = t
    if (planet.current) {
      planet.current.rotation.y = t * 0.08 + pointer.x * 0.15
      planet.current.rotation.x = 0.35 + pointer.y * 0.08
    }
  })

  return (
    <>
      <group ref={planet}>
        <mesh>
          <sphereGeometry args={[1.57, 48, 48]} />
          <meshBasicMaterial color='#070807' transparent opacity={0.92} />
        </mesh>
        <Particles positions={globe} sizeRange={[1.8, 3.2]} material={globeMat} />
      </group>
      <RimSphere radius={1.72} color={accent} power={3.2} opacity={0.7} additive={additive} />
      <OrbitRing radius={2.3} tilt={[1.35, 0, 0.35]} color={accent} opacity={0.45} speed={0.8} />
      <OrbitRing radius={2.75} tilt={[1.2, 0.3, -0.25]} color={base} opacity={0.14} speed={-0.5} dashed />
      <Particles positions={dust} sizeRange={[0.6, 1.5]} material={dustMat} />
    </>
  )
}

export default function OrbScene({ variant, lowPower, active }: SceneProps & { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, lowPower ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      {variant === 'hero' ? <HeroOrb lowPower={lowPower} /> : <PlanetOrb lowPower={lowPower} />}
    </Canvas>
  )
}
