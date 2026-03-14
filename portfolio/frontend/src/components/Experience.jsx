import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'

export default function Experience({ experience }) {
  if (!experience?.length) return null

  return (
    <section id="experience" className="py-24 px-6 relative overflow-hidden">
      {/* Subtle bg blob */}
      <div className="blob w-[500px] h-[500px] bg-indigo-600/5 top-0 right-0" style={{ animationDelay: '-3s' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-indigo-400 text-sm font-mono tracking-widest uppercase mb-3">Where I've worked</p>
          <h2 className="section-title gradient-text">Work Experience</h2>
        </motion.div>

        <div className="relative">
          {/* Gradient timeline line */}
          <div className="absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/60 via-purple-500/40 to-transparent" />

          <div className="space-y-6">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="relative pl-20"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              >
                {/* Timeline node */}
                <motion.div
                  className="absolute left-[29px] top-5 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#050814] shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
                />

                <div className="glass rounded-2xl p-6 group hover:shadow-[0_0_40px_rgba(99,102,241,0.08)] transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-indigo-300 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-1.5 text-indigo-400 font-medium mt-0.5">
                        <Briefcase size={13} />
                        <span>{exp.company}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={11} />
                        {exp.start_date} — {exp.is_current
                          ? <span className="text-green-400 font-medium">Present</span>
                          : exp.end_date}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <MapPin size={11} />
                          {exp.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {exp.is_current && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Currently here
                    </div>
                  )}

                  {exp.description && (
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
