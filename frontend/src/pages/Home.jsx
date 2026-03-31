// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/shared/Navbar';
import Hero from '../components/home/Hero';
import Aboutus from '../components/home/Aboutus';
import Contactus from '../components/home/Contactus';
import Footer from '../components/shared/Footer';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'stats', 'how-it-works', 'about', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <Navbar activeSection={activeSection} />
      <main>
        <section id="hero" className="relative -mt-24">
          <Hero />
        </section>

        <section id="features">
          <Features />
        </section>

        <section id="stats">
          <Stats />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="about">
          <Aboutus />
        </section>

        <section id="testimonials">
          <Testimonials />
        </section>

        <section id="contact">
          <Contactus />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;