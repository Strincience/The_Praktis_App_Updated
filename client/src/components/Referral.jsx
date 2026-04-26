import { motion } from 'framer-motion'
import { useState } from 'react'

const REFERRAL_LINK = 'https://praktis.community' // Replace with real link

export default function Referral({ name }) {
  const [copied, setCopied] = useState(false)

  const firstName = name?.split(' ')[0] || 'Hey'

  const shareText = `I just joined the Praktis waitlist a creative community for people serious about building real skills. Join me! 🎨🎬✍️ ${REFERRAL_LINK}`

  const copyLink = () => {
    navigator.clipboard.writeText(REFERRAL_LINK)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')

  return (
    <section id="waitlist" className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
        >
          <span className="text-4xl">🎉</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mb-4">
            You're in, <span className="gradient-text">{firstName}!</span>
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Your application is submitted. We'll be in touch when Praktis opens its doors.
            In the meantime help us build a community of committed creatives.
          </p>
        </motion.div>

        {/* Referral card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-[#F9F9FB] rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm mb-8"
        >
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-white text-xl">🔗</span>
          </div>
          <h3 className="font-heading font-bold text-2xl text-dark mb-3">
            Refer Praktis to 5 people
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Know someone serious about growing their creative skills? Share Praktis with them.
            The strongest communities are built by the people in them.
          </p>

          {/* Link copy */}
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-3 mb-6 text-left">
            <span className="text-gray-400 text-sm flex-1 truncate font-body">{REFERRAL_LINK}</span>
            <button
              onClick={copyLink}
              className={`flex-shrink-0 text-xs font-heading font-semibold px-4 py-2 rounded-lg transition-all ${
                copied
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'gradient-bg text-white hover:opacity-90'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-heading font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </button>
            <button
              onClick={shareTwitter}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1DA1F2] text-white font-heading font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on Twitter
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-gray-400"
        >
          Every person you refer helps us build a stronger creative community. Thank you. 🙏
        </motion.p>
      </div>
    </section>
  )
}
