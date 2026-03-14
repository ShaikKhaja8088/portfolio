import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Settings, Menu, X } from 'lucide-react'
import { getPortfolio } from '../api/client'
import Hero from '../components/Hero'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Education from '../components/Education'
import Contact from '../components/Contact'

const NAV = [
  { id: 'hero',       label: 'Home' },
  { id: 'skills',     label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'education',  label: 'Education' },
  { id: 'contact',    label: 'Contact' },
]

function useScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return pct
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      return obs
    }).filter(Boolean)
    return () => observers.forEach(o => o.disconnect())
  }, [ids])
  return active
}

// Cursor glow that follows mouse
function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px'
        ref.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-0 w-96 h-96 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.15s ease-out, top 0.15s ease-out',
      }}
    />
  )
}

export default function Portfolio() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollPct = useScrollProgress()
  const activeSection = useActiveSection(NAV.map(n => n.id))

  useEffect(() => {
    getPortfolio()
      .then(r => setData(r.data))
      .catch(() => setError('Could not load portfolio. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050814' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <p className="text-slate-500 text-sm">Loading portfolio...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: '#050814' }}>
      <p className="text-red-400 mb-4">{error}</p>
      <Link to="/admin" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm transition-colors">
        Go to Admin →
      </Link>
    </div>
  )

  const isEmpty = !data?.meta?.name

  return (
    <div className="relative" style={{ background: '#050814', minHeight: '100vh' }}>
      <CursorGlow />

      {/* Scroll progress bar */}
      <div className="scroll-bar" style={{ width: `${scrollPct}%` }} />

      {/* Navbar */}
      <motion.nav
        className={`fixed top-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass rounded-2xl px-5 py-2.5 shadow-lg shadow-black/30 border border-white/8'
            : 'px-5 py-3'
        }`}
        style={{ width: scrolled ? 'auto' : '100%', maxWidth: '900px' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-6">
          <span className="gradient-text-accent font-bold text-sm tracking-wide mr-auto">
            {data?.meta?.name?.split(' ')[0] || 'Portfolio'}
          </span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`relative px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeSection === id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {activeSection === id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-500/15 rounded-lg border border-indigo-500/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </a>
            ))}
          </div>

          <Link to="/admin" className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-300 transition-colors">
            <Settings size={12} /> Admin
          </Link>

          {/* Mobile menu btn */}
          <button className="md:hidden text-slate-400" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden mt-3 pt-3 border-t border-white/8 flex flex-col gap-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {NAV.map(({ id, label }) => (
                <a key={id} href={`#${id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm ${activeSection === id ? 'text-white bg-indigo-500/15' : 'text-slate-500'}`}>
                  {label}
                </a>
              ))}
              <Link to="/admin" className="px-3 py-2 text-xs text-slate-600" onClick={() => setMobileOpen(false)}>
                Admin Panel
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {isEmpty ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <Settings size={32} className="text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">Your Portfolio</h1>
            <p className="text-slate-400 mb-8 max-w-sm">
              Upload your resume in the admin panel — AI will populate everything automatically.
            </p>
            <Link to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105">
              Open Admin Panel →
            </Link>
          </motion.div>
        </div>
      ) : (
        <>
          <Hero meta={data.meta} />
          <Skills skills={data.skills} />
          <Experience experience={data.experience} />
          <Projects projects={data.projects} />
          <Education education={data.education} certifications={data.certifications} />
          <Contact meta={data.meta} />
        </>
      )}
    </div>
  )
}
