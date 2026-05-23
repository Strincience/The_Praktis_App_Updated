import Navbar          from '../components/Navbar'
import Hero            from '../components/Hero'
import About           from '../components/About'
import MissionVision   from '../components/MissionVision'
import WhatYoullLearn  from '../components/WhatYoullLearn'
import Transformation  from '../components/Transformation'
import HowItWorks      from '../components/HowItWorks'
import PraktisGame     from '../components/PraktisGame'
import JoinSection     from '../components/JoinSection'
import JoinModal       from '../components/JoinModal'
import Footer          from '../components/Footer'

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/*
        JoinModal is rendered outside the normal flow.
        It hides itself until any button fires window.dispatchEvent(new Event('praktis:openModal'))
        No props needed — it self-manages via the custom event.
      */}
      <JoinModal />

      <Navbar />
      <Hero />
      <About />
      <Transformation />
      <WhatYoullLearn />
      <PraktisGame />
      <HowItWorks />
      <JoinSection />
      <Footer />
    </div>
  )
}
