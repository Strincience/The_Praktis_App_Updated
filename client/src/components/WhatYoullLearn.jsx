import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const tracks = [
  {
    icon: '🎨',
    title: 'Creative Design',
    desc: 'Visual identity, graphic design, brand design, UI/UX fundamentals.',
    tags: ['Canva', 'Figma', 'Adobe'],
    color: '#FF6B2C',
  },
  {
    icon: '🎬',
    title: 'Video Editing',
    desc: 'Storytelling through film. Learn to cut, colour, and create compelling videos.',
    tags: ['Premiere', 'DaVinci', 'CapCut'],
    color: '#FF3E7A',
  },
  {
    icon: '📸',
    title: 'Photography',
    desc: 'Composition, lighting, and visual storytelling with a camera.',
    tags: ['Lightroom', 'Capture', 'Studio'],
    color: '#7B3FE4',
  },
  {
    icon: '✍️',
    title: 'Content Creation',
    desc: 'Create content that resonates — copy, social media, storytelling.',
    tags: ['Social', 'Copy', 'Strategy'],
    color: '#FF6B2C',
  },
  {
    icon: '🎥',
    title: 'Cinematography',
    desc: 'Professional cameras, filmmaking, drone piloting, and production.',
    tags: ['Film', 'Drone', 'Production'],
    color: '#FF3E7A',
    badge: 'Coming Soon',
  },
  {
    icon: '🎭',
    title: 'Brand Design',
    desc: 'Build brands that people remember. Logo, identity, and system design.',
    tags: ['Branding', 'Identity', 'Strategy'],
    color: '#7B3FE4',
  },
]

export default function WhatYoullLearn() {
  const [ref, inView] = useInView(0.1)

  return (
    <section id="learn" ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#FF3E7A]">The Tracks</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-3 mb-5">
            What you'll learn & <span className="gradient-text">practice</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Choose your creative track. Build skills through structured practice and real projects.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative bg-[#F9F9FB] rounded-2xl p-7 border border-gray-100 cursor-default hover:shadow-lg transition-shadow"
            >
              {track.badge && (
                <span className="absolute top-4 right-4 text-xs font-heading font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                  {track.badge}
                </span>
              )}
              {/* Icon bubble */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-transform group-hover:scale-110"
                style={{ background: `${track.color}15` }}
              >
                {track.icon}
              </div>

              <h3 className="font-heading font-bold text-lg text-dark mb-2">{track.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{track.desc}</p>

              <div className="flex flex-wrap gap-2">
                {track.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-xs font-heading font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${track.color}12`, color: track.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom accent bar on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, ${track.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
