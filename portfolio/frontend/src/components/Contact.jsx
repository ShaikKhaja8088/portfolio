import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, Globe, Phone, ArrowUpRight } from 'lucide-react'

const LINK_STYLES = {
  Email:    { accent: 'text-pink-400',   bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
  LinkedIn: { accent: 'text-blue-400',   bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  GitHub:   { accent: 'text-slate-300',  bg: 'bg-slate-500/10',   border: 'border-slate-500/20' },
  Twitter:  { accent: 'text-cyan-400',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  Website:  { accent: 'text-indigo-400', bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20' },
  Phone:    { accent: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20' },
}

export default function Contact({ meta }) {
  if (!meta) return null

  const links = [
    { href: meta.email ? `mailto:${meta.email}` : '', icon: Mail,     label: meta.email,    text: 'Email' },
    { href: meta.linkedin,                             icon: Linkedin, label: meta.linkedin,  text: 'LinkedIn' },
    { href: meta.github,                               icon: Github,   label: meta.github,    text: 'GitHub' },
    { href: meta.twitter,                              icon: Twitter,  label: meta.twitter,   text: 'Twitter' },
    { href: meta.website,                              icon: Globe,    label: meta.website,   text: 'Website' },
    { href: meta.phone ? `tel:${meta.phone}` : '',    icon: Phone,    label: meta.phone,     text: 'Phone' },
  ].filter(l => l.href && l.label)

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="blob w-[500px] h-[500px] bg-indigo-600/8 bottom-0 right-0" style={{ animationDelay: '-5s' }} />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-indigo-400 text-sm font-mono tracking-widest uppercase mb-3">Let's connect</p>
          <h2 className="section-title gradient-text mb-4">Get In Touch</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-12">
            Open to new opportunities, collaborations, or just a friendly conversation.
          </p>
        </motion.div>

        {links.length > 0 && (
          <motion.div
            className="grid sm:grid-cols-2 gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {links.map(({ href, icon: Icon, label, text }, i) => {
              const st = LINK_STYLES[text] || LINK_STYLES.Email
              return (
                <motion.a
                  key={text}
                  href={href}
                  target={href.startsWith('mailto') || href.startsWith('tel') ? '_self' : '_blank'}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`group flex items-center gap-4 p-4 rounded-2xl glass text-left ${st.border} border transition-all`}
                  whileHover={{ x: 4, scale: 1.02 }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className={`w-11 h-11 rounded-xl ${st.bg} border ${st.border} flex items-center justify-center ${st.accent} shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">{text}</p>
                    <p className="text-white text-sm font-medium truncate">{label}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </motion.a>
              )
            })}
          </motion.div>
        )}

        <motion.p
          className="text-slate-700 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Built with FastAPI · React · Gemini AI · SQLite
        </motion.p>
      </div>
    </section>
  )
}
