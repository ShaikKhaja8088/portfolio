import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Globe, MapPin, Download, ArrowDown } from 'lucide-react'
import { getResumeDownloadUrl } from '../api/client'

function useTypewriter(words, speed = 80, pause = 2200) {
  const [text, setText] = useState('')
  const [wi, setWi] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wi % words.length]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1))
        if (text === word) setTimeout(() => setDeleting(true), pause)
      } else {
        setText(word.slice(0, text.length - 1))
        if (text === '') { setDeleting(false); setWi(i => i + 1) }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [text, deleting, wi, words, speed, pause])

  return text
}

export default function Hero({ meta }) {
  const titles = meta?.title
    ? [meta.title, ...(meta.title.includes('/') ? meta.title.split('/').map(s => s.trim()) : [])]
    : ['Software Engineer', 'Full Stack Developer', 'Problem Solver']
  const typeText = useTypewriter([...new Set(titles)])

  if (!meta) return null

  const socials = [
    { href: meta.github, icon: Github, label: 'GitHub' },
    { href: meta.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: meta.twitter, icon: Twitter, label: 'Twitter' },
    { href: meta.website, icon: Globe, label: 'Website' },
    { href: meta.email ? `mailto:${meta.email}` : '', icon: Mail, label: 'Email' },
  ].filter(s => s.href)

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Animated blobs */}
      <div className="blob w-[500px] h-[500px] bg-indigo-600/20 -top-32 -left-32" style={{ animationDelay: '0s' }} />
      <div className="blob w-[400px] h-[400px] bg-purple-600/15 -bottom-20 -right-20" style={{ animationDelay: '-4s' }} />
      <div className="blob w-[300px] h-[300px] bg-cyan-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '-7s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full text-center">
        {meta.photo_url && (
          <motion.div
            className="relative inline-block mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 blur-md opacity-60 scale-110" />
            <img
              src={meta.photo_url}
              alt={meta.name}
              className="relative w-28 h-28 rounded-full object-cover border-2 border-white/10"
            />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-indigo-300 mb-6 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available for opportunities
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl font-bold mb-4 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">{meta.name || 'Your Name'}</span>
        </motion.h1>

        <motion.div
          className="text-xl sm:text-2xl text-slate-400 font-mono mb-4 h-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="gradient-text-accent">{typeText}</span>
          <span className="cursor text-indigo-400 ml-0.5">|</span>
        </motion.div>

        {meta.location && (
          <motion.p
            className="flex items-center justify-center gap-1.5 text-slate-500 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <MapPin size={13} />
            {meta.location}
          </motion.p>
        )}

        {meta.bio && (
          <motion.p
            className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {meta.bio}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {meta.resume_filename ? (
            <a
              href={getResumeDownloadUrl()}
              download={meta.resume_filename}
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Download size={15} className="group-hover:animate-bounce" />
              Download Resume
            </a>
          ) : (
            <span
              title="Upload a resume in the admin panel first"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-600 text-sm font-medium cursor-not-allowed select-none"
            >
              <Download size={15} />
              Download Resume
            </span>
          )}
          {meta.email && (
            <a
              href={`mailto:${meta.email}`}
              className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-indigo-500/20 text-slate-300 hover:text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Mail size={15} />
              Say Hello
            </a>
          )}
        </motion.div>

        {/* Social links */}
        {socials.length > 0 && (
          <motion.div
            className="flex justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                title={label}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all hover:scale-110"
              >
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
