import { motion } from 'framer-motion'

const CAT_STYLES = {
  Backend:  { bg: 'from-blue-600/10 to-blue-800/5',   border: 'border-blue-500/20',   dot: 'bg-blue-400',   text: 'text-blue-300' },
  Frontend: { bg: 'from-violet-600/10 to-violet-800/5', border: 'border-violet-500/20', dot: 'bg-violet-400', text: 'text-violet-300' },
  DevOps:   { bg: 'from-orange-600/10 to-orange-800/5', border: 'border-orange-500/20', dot: 'bg-orange-400', text: 'text-orange-300' },
  Database: { bg: 'from-green-600/10 to-green-800/5',  border: 'border-green-500/20',  dot: 'bg-green-400',  text: 'text-green-300' },
  Mobile:   { bg: 'from-pink-600/10 to-pink-800/5',    border: 'border-pink-500/20',   dot: 'bg-pink-400',   text: 'text-pink-300' },
  'AI/ML':  { bg: 'from-yellow-600/10 to-yellow-800/5',border: 'border-yellow-500/20', dot: 'bg-yellow-400', text: 'text-yellow-300' },
  Other:    { bg: 'from-slate-600/10 to-slate-800/5',  border: 'border-slate-500/20',  dot: 'bg-slate-400',  text: 'text-slate-300' },
  General:  { bg: 'from-indigo-600/10 to-indigo-800/5',border: 'border-indigo-500/20', dot: 'bg-indigo-400', text: 'text-indigo-300' },
}


// Map skill names (lowercase) → Simple Icons slug
const ICON_MAP = {
  // Languages
  'python': 'python', 'javascript': 'javascript', 'typescript': 'typescript',
  'java': 'java', 'go': 'go', 'rust': 'rust', 'c++': 'cplusplus', 'c#': 'csharp',
  'php': 'php', 'ruby': 'ruby', 'kotlin': 'kotlin', 'swift': 'swift',
  'r': 'r', 'scala': 'scala', 'dart': 'dart',
  // Backend
  'fastapi': 'fastapi', 'flask': 'flask', 'django': 'django',
  'express': 'express', 'expressjs': 'express', 'spring': 'spring',
  'laravel': 'laravel', 'rails': 'rubyonrails', 'nestjs': 'nestjs',
  'node.js': 'nodedotjs', 'nodejs': 'nodedotjs',
  // Frontend
  'react': 'react', 'vue': 'vuedotjs', 'vue.js': 'vuedotjs', 'vuejs': 'vuedotjs',
  'angular': 'angular', 'svelte': 'svelte', 'nextjs': 'nextdotjs', 'next.js': 'nextdotjs',
  'nuxt': 'nuxtdotjs', 'tailwindcss': 'tailwindcss', 'tailwind': 'tailwindcss',
  'bootstrap': 'bootstrap', 'sass': 'sass', 'redux': 'redux',
  'html': 'html5', 'css': 'css3',
  // Databases
  'postgresql': 'postgresql', 'postgres': 'postgresql',
  'mysql': 'mysql', 'mongodb': 'mongodb', 'redis': 'redis',
  'sqlite': 'sqlite', 'elasticsearch': 'elasticsearch',
  'cassandra': 'apachecassandra', 'dynamodb': 'amazondynamodb',
  // DevOps / Cloud
  'docker': 'docker', 'kubernetes': 'kubernetes', 'k8s': 'kubernetes',
  'git': 'git', 'github': 'github', 'gitlab': 'gitlab', 'bitbucket': 'bitbucket',
  'aws': 'amazonaws', 'amazon web services': 'amazonaws',
  'google cloud': 'googlecloud', 'gcp': 'googlecloud',
  'azure': 'microsoftazure', 'terraform': 'terraform',
  'jenkins': 'jenkins', 'nginx': 'nginx', 'linux': 'linux',
  'ubuntu': 'ubuntu', 'ansible': 'ansible',
  // Cloud services
  'google cloud storage (gcs)': 'googlecloudstorage',
  'aws lambda': 'awslambda',
  // Message queues
  'kafka': 'apachekafka', 'apache kafka': 'apachekafka',
  'rabbitmq': 'rabbitmq', 'celery': 'celery',
  // Tools
  'jira': 'jira', 'confluence': 'confluence', 'slack': 'slack',
  'postman': 'postman', 'figma': 'figma', 'vscode': 'visualstudiocode',
  'pycharm': 'pycharm', 'intellij': 'intellijidea',
  // ML/AI
  'tensorflow': 'tensorflow', 'pytorch': 'pytorch',
  'scikit-learn': 'scikitlearn', 'pandas': 'pandas', 'numpy': 'numpy',
  // Testing
  'jest': 'jest', 'pytest': 'pytest', 'cypress': 'cypress',
  // Misc
  'graphql': 'graphql', 'rest api': 'fastapi', 'grpc': 'grpc',
  'object-oriented programming': 'python', 'oop': 'python',
  'agile': 'agile', 'agile/scrum': 'jira', 'scrum': 'jira',
  'unit testing': 'pytest', 'windows': 'windows11',
}

function getIconSlug(name) {
  return ICON_MAP[name.toLowerCase()] || null
}

const getStyle = (cat) => CAT_STYLES[cat] || CAT_STYLES.Other

const LEVEL_LABEL = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']

export default function Skills({ skills }) {
  if (!skills?.length) return null

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-indigo-400 text-sm font-mono tracking-widest uppercase mb-3">What I work with</p>
          <h2 className="section-title gradient-text">Skills & Technologies</h2>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(grouped).map(([cat, items], gi) => {
            const s = getStyle(cat)
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>{cat}</h3>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-slate-600 text-xs">{items.length} skills</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {items.map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      className={`relative group p-3 rounded-xl glass border ${s.border} bg-gradient-to-br ${s.bg} cursor-default overflow-hidden`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.06, y: -2 }}
                    >
                      {/* Shimmer on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                      {/* Icon */}
                      {(() => {
                        const slug = getIconSlug(skill.name)
                        return slug ? (
                          <img
                            src={`https://cdn.simpleicons.org/${slug}/94a3b8`}
                            alt={skill.name}
                            className="w-6 h-6 mb-2 opacity-70 group-hover:opacity-100 transition-opacity"
                            onError={e => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div className={`w-6 h-6 mb-2 rounded-md ${s.bg.split(' ')[0].replace('from-', 'bg-')} flex items-center justify-center`}>
                            <span className={`text-xs font-bold ${s.text}`}>{skill.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                        )
                      })()}

                      <p className="text-white text-sm font-medium truncate">{skill.name}</p>
                      <p className={`text-xs mt-0.5 ${s.text} opacity-70`}>{LEVEL_LABEL[skill.proficiency] || ''}</p>

                      {/* Proficiency dots */}
                      <div className="flex gap-1 mt-2">
                        {[1,2,3,4,5].map(d => (
                          <div
                            key={d}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${d <= skill.proficiency ? s.dot : 'bg-white/10'}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
