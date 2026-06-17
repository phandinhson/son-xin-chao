import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import FloatingContacts from "@/components/FloatingContacts";
import SearchStrip from "@/components/SearchStrip";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <SearchStrip />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Pricing />
      <Blog />
      <Contact />
      <Footer />
      <MobileBar />
      <FloatingContacts />
    </main>
  );
}
