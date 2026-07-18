import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import AboutSection from '../components/AboutSection';
import ServicesOne from '../components/ServicesOne';
import CtaOne from '../components/CtaOne';
import OurProcess from '../components/OurProcess';
import HelpYouChoose from '../components/HelpYouChoose';
import WhyChoose from '../components/WhyChoose';
import ProjectsOne from '../components/ProjectsOne';
import BrandsMarquee from '../components/BrandsMarquee';
import HomeNewArrivals from '../components/HomeNewArrivals';
import TestimonialSlider from '../components/TestimonialSlider';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import './Home.css';

export default function Home() {
  const heroRef = useRef(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsHeroVisible(entry.isIntersecting);
    });

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12 // Trigger when 12% of the element is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target); // Unobserve once animated
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="page-wrapper home-page">
      <Header />
      <HeroSlider ref={heroRef} isActive={isHeroVisible} />
      
      <AboutSection />
      
      <ProjectsOne />
      <BrandsMarquee />
      <HomeNewArrivals />
      <ServicesOne />
      <CtaOne />
      
      <div className="reveal-on-scroll">
        <WhyChoose />
      </div>
      
      <div className="reveal-on-scroll">
        <OurProcess />
      </div>

      <div className="reveal-on-scroll">
        <HelpYouChoose />
      </div>
      
      <div className="reveal-on-scroll">
        <BlogSection />
      </div>
      
      <TestimonialSlider />
      <Footer />
      <BackToTop hideWhatsApp={isHeroVisible} />
    </div>
  );
}
