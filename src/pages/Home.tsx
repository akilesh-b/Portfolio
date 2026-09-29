import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { bindPointer } from '../lib/motionState'
import { useActiveSection } from '../hooks/useActiveSection'
import { Loader } from '../components/Loader'
import { Navbar } from '../components/Navbar'
import { PageProgress } from '../components/PageProgress'
import { CustomCursor } from '../components/CustomCursor'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { TechStack } from '../components/TechStack'
import { Journey } from '../components/Journey'
import { AILab } from '../components/AILab'
import { Writing } from '../components/Writing'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'

export default function Home() {
  const [ready, setReady] = useState(false)
  const active = useActiveSection()
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    bindPointer()
  }, [])

  // Fonts / images can shift layout after load — re-measure triggers once settled.
  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(id)
  }, [ready])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!ready && <Loader onDone={done} />}
      <Navbar active={active} />
      <PageProgress active={active} />
      <CustomCursor />

      <main id="main" className="relative isolate">
        <Hero ready={ready} />
        <About />
        <TechStack />
        <Journey />
        <AILab />
        <Writing />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  )
}
