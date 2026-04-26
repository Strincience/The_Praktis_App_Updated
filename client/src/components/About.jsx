import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const problems = [
  { icon: '🧩', title: 'No structure', desc: 'Great ideas die without a system to develop them.' },
  { icon: '🏝️', title: 'Learning in isolation', desc: 'Talent grows faster in community, not in silence.' },
  { icon: '📚', title: 'Theory without practice', desc: 'Most platforms teach. Few give you space to actually do.' },
]

export default function About() {
  const [ref, inView] = useInView(0.15)

  return (
    <section id="about" ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#FF6B2C]">About Praktis</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-3 mb-5">
            Built for the creative who feels <span className="gradient-text">stuck</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Praktis is not a course platform. It's a creative community where you learn by doing
            working on real projects, getting real feedback, and building real skills.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-[#F9F9FB] rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-heading font-semibold text-dark text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="gradient-bg p-px rounded-3xl">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-10 md:p-14 text-center">
              <p className="font-heading font-bold text-2xl md:text-3xl text-dark leading-snug">
                "Praktis gives you the structure, the community, and the real-world practice
                to go from <span className="gradient-text">idea to craft.</span>"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
