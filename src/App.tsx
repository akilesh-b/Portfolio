import { SmoothScrollProvider } from './hooks/useLenis'
import Home from './pages/Home'

export default function App() {
  return (
    <SmoothScrollProvider>
      <Home />
    </SmoothScrollProvider>
  )
}
