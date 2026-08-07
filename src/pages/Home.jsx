import Hero from "../components/Hero";
import About from "../components/About";
import Portfolio from "../components/Portfolio";
import Services from "../components/Services";
import TVWork from "../components/TVWork";
import Academy from "../components/Academy";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About compact />
      <Portfolio />
      <Services limit={4} showAllLink />
      <TVWork />
      <Academy />
      <Testimonials />
      <Contact />
    </>
  );
}
