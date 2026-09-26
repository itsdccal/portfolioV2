import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroLoader from "@/components/IntroLoader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import SkillsMatrix from "@/components/SkillsMatrix";
import Projects from "@/components/Projects";
import ProjectArchive from "@/components/ProjectArchive";
import Roadmap from "@/components/Roadmap";
import Certifications from "@/components/Certifications";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <IntroLoader />
      <SmoothScroll />
      <GrainOverlay />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <SkillsMatrix />
      <Projects />
      <ProjectArchive />
      <Marquee />
      <Roadmap />
      <Certifications />
      <Marquee />
      <Footer />
    </main>
  );
}
