import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const steps = [
  {
    num: '01',
    title: 'Join',
    desc: 'Apply through our waitlist. Tell us about your creative goals and commitment level.',
    color: '#FF6B2C',
  },
  {
    num: '02',
    title: 'Choose a track',
    desc: 'Pick the creative discipline you want to build design, video, content, and more.',
    color: '#FF3E7A',
  },
  {
    num: '03',
    title: 'Practice consistently',
    desc: 'Follow structured exercises, get feedback from the community, and track your growth.',
    color: '#7B3FE4',
  },
  {
    num: '04',
    title: 'Build real projects',
    desc: 'Work on actual briefs from creative partners. Build your portfolio with real-world output.',
    color: '#FF6B2C',
  },
]

export default function HowItWorks() {
  const [ref, inView] = useInView(0.1)

  return (
    <section id="how" ref={ref} className="py-24 px-6 bg-[#F9F9FB]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#7B3FE4]">The Process</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-3">
            How it <span className="gradient-text">works</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div
                  className="relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center mb-6 shadow-md"
                  style={{ background: `${step.color}15`, border: `2px solid ${step.color}30` }}
                >
                  <span
                    className="font-heading font-bold text-xl"
                    style={{ color: step.color }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-dark mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <a
            href="#waitlist"
            className="inline-block gradient-bg text-white font-heading font-semibold px-10 py-4 rounded-full text-base hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Your Journey →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
