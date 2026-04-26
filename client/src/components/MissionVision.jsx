import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

export default function MissionVision() {
  const [ref, inView] = useInView(0.15)

  return (
    <section ref={ref} className="py-24 px-6 bg-[#F9F9FB]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#7B3FE4]">Purpose</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-3">
            Mission & <span className="gradient-text">Vision</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative bg-white rounded-3xl p-10 border border-gray-100 shadow-sm overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
              style={{ background: 'linear-gradient(to bottom, #FF6B2C, #FF3E7A)' }}
            />
            <div className="pl-4">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🎯</span>
              </div>
              <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#FF6B2C]">Mission</span>
              <h3 className="font-heading font-bold text-2xl text-dark mt-2 mb-4">Help people build creative skill through consistent practice</h3>
              <p className="text-gray-500 leading-relaxed">
                We believe every creative mind deserves a structured environment to grow.
                Praktis bridges the gap between inspiration and mastery — through practice,
                real projects, and a community that pushes you forward.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative bg-white rounded-3xl p-10 border border-gray-100 shadow-sm overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-3xl"
              style={{ background: 'linear-gradient(to bottom, #FF3E7A, #7B3FE4)' }}
            />
            <div className="pl-4">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🌍</span>
              </div>
              <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#7B3FE4]">Vision</span>
              <h3 className="font-heading font-bold text-2xl text-dark mt-2 mb-4">A world where creativity is developed, not assumed</h3>
              <p className="text-gray-500 leading-relaxed">
                We envision a generation of creatives who don't wait to feel talented — they
                practice until they are. From design to filmmaking, Praktis will be the
                home where African creative potential becomes world-class craft.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Practice over perfection', color: '#FF6B2C' },
            { label: 'Real-world relevance', color: '#FF3E7A' },
            { label: 'Community as currency', color: '#7B3FE4' },
            { label: 'Growth in every direction', color: '#FF6B2C' },
          ].map((v, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 text-center bg-white border border-gray-100"
            >
              <div
                className="w-2 h-2 rounded-full mx-auto mb-3"
                style={{ background: v.color }}
              />
              <p className="font-heading font-semibold text-sm text-dark">{v.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
