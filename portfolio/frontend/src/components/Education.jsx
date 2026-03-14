import { motion } from 'framer-motion'
import { GraduationCap, Award, ExternalLink, CalendarDays } from 'lucide-react'

export default function Education({ education, certifications }) {
  const hasEdu = education?.length > 0
  const hasCerts = certifications?.length > 0
  if (!hasEdu && !hasCerts) return null

  return (
    <section id="education" className="py-24 px-6 relative overflow-hidden">
      <div className="blob w-[400px] h-[400px] bg-purple-600/5 top-0 right-0" style={{ animationDelay: '-2s' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-indigo-400 text-sm font-mono tracking-widest uppercase mb-3">Background</p>
          <h2 className="section-title gradient-text">Education & Certifications</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {hasEdu && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <GraduationCap size={14} className="text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold">Education</h3>
              </div>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <motion.div
                    key={edu.id}
                    className="glass rounded-2xl p-5 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold group-hover:text-indigo-300 transition-colors">
                          {edu.institution}
                        </p>
                        <p className="text-indigo-400 text-sm mt-0.5">
                          {edu.degree}{edu.field ? ` · ${edu.field}` : ''}
                        </p>
                      </div>
                      {edu.gpa && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 shrink-0">
                          GPA {edu.gpa}
                        </span>
                      )}
                    </div>
                    {(edu.start_year || edu.end_year) && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-2">
                        <CalendarDays size={11} />
                        {edu.start_year}{edu.end_year ? ` – ${edu.end_year}` : ''}
                      </div>
                    )}
                    {edu.description && (
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {hasCerts && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Award size={14} className="text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold">Certifications</h3>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    className="glass rounded-2xl p-5 group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: -4 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold group-hover:text-yellow-300 transition-colors">{cert.name}</p>
                        <p className="text-yellow-400/70 text-sm mt-0.5">{cert.issuer}</p>
                      </div>
                      {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                          className="text-slate-500 hover:text-white transition-colors shrink-0">
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    {cert.date && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-2">
                        <CalendarDays size={11} />
                        {cert.date}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
