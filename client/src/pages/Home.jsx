import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import MissionVision from '../components/MissionVision'
import WhatYoullLearn from '../components/WhatYoullLearn'
import Transformation from '../components/Transformation'
import HowItWorks from '../components/HowItWorks'
import PraktisGame from '../components/PraktisGame'
import WaitlistForm from '../components/WaitlistForm'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Transformation />
      <WhatYoullLearn />
      <PraktisGame />
      <HowItWorks />
      <WaitlistForm />
      <Footer />
    </div>
  )
}
