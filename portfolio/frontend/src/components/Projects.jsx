import { motion } from 'framer-motion'
import { Github, ExternalLink, Layers } from 'lucide-react'

const CARD_GRADIENTS = [
  'from-indigo-600/20 to-purple-600/10',
  'from-purple-600/20 to-cyan-600/10',
  'from-cyan-600/20 to-blue-600/10',
  'from-blue-600/20 to-indigo-600/10',
]

export default function Projects({ projects }) {
  if (!projects?.length) return null

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      <div className="blob w-[400px] h-[400px] bg-cyan-600/5 bottom-0 left-0" style={{ animationDelay: '-6s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-indigo-400 text-sm font-mono tracking-widest uppercase mb-3">What I've built</p>
          <h2 className="section-title gradient-text">Projects</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="group relative glass rounded-2xl overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              {/* Card header */}
              <div className={`relative h-32 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} p-5 overflow-hidden`}>
                {project.image_url ? (
                  <img src={project.image_url} alt={project.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-105 group-hover:scale-100" />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <Layers size={18} className="text-indigo-400" />
                  </div>
                </div>

                {/* Hover shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>

              {/* Card body */}
              <div className="flex-1 p-5 flex flex-col">
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-indigo-300 transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {project.description}
                  </p>
                )}

                {project.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack.map(tech => (
                      <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-white/5">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
                      <Github size={13} /> Source
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors ml-auto">
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
