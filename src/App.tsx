import { useCallback, useEffect, useState } from 'react'
import { Backdrop } from './components/chrome/Backdrop'
import { BootSequence, hasBooted } from './components/chrome/BootSequence'
import { CommandPalette } from './components/chrome/CommandPalette'
import { Cursor } from './components/chrome/Cursor'
import { Grain } from './components/chrome/Grain'
import { GridLines } from './components/chrome/GridLines'
import { Header } from './components/chrome/Header'
import { Rail } from './components/chrome/Rail'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Impact } from './components/sections/Impact'
import { Lab } from './components/sections/Lab'
import { Profile } from './components/sections/Profile'
import { Stack } from './components/sections/Stack'
import { Trajectory } from './components/sections/Trajectory'
import { Work } from './components/sections/Work'
import { LocaleProvider, useLocale } from './i18n/LocaleContext'
import { ScrollProvider } from './lib/ScrollProvider'
import { TransitionProvider } from './lib/TransitionProvider'
import { useReducedMotion } from './lib/useMotionPref'

function Page() {
  const { locale } = useLocale()
  const reduced = useReducedMotion()
  const [booting, setBooting] = useState(() => !hasBooted() && !reduced)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName ?? '')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a className="skip" href="#profile">
        {locale === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'}
      </a>

      <Backdrop />
      <GridLines />
      <Grain />
      <Cursor />
      <Rail />
      <Header onOpenPalette={() => setPaletteOpen(true)} />

      <main className="shell">
        <Hero ready={!booting} />
        <Profile />
        <Trajectory />
        <Work />
        <Impact />
        <Stack />
        <Lab />
        <Contact />
      </main>

      <CommandPalette open={paletteOpen} onClose={closePalette} />
      {booting ? <BootSequence onDone={() => setBooting(false)} /> : null}
    </>
  )
}

export function App() {
  return (
    <LocaleProvider>
      <ScrollProvider>
        <TransitionProvider>
          <Page />
        </TransitionProvider>
      </ScrollProvider>
    </LocaleProvider>
  )
}
