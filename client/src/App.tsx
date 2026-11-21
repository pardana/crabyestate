import { HeroSection } from "./sections/hero-sections"
import { Stats } from "./sections/stats"
import { Gallery } from "./sections/gallery"
import { WhyChooseUs } from "./sections/why-choose-us"
import { Testimonials } from "./sections/testimonials"
import { CallToAction } from "./sections/call-to-action"
import { Contact } from "./sections/contact"
import { Footer } from "./components/footer"
import { Navbar } from "./components/navbar";
import LenisScroll from "./components/lenis-scroll"

function App() {

  return (
    <>
      <LenisScroll />
      <Navbar />
      <HeroSection />
      <Stats />
      <Gallery />
      <WhyChooseUs />
      <Testimonials />  
      <CallToAction />
      <Contact />
      <Footer />
    </>
  )
}

export default App
