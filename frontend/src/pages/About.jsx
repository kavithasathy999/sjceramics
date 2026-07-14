import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import AboutPageOverview from '../components/AboutPageOverview';
import PurposeValue from '../components/PurposeValue';
import MapLocation from '../components/MapLocation';
import ChooseTabSection from '../components/ChooseTabSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import bannerBg from '../assets/images/background/25.jpg';

import roomImg from '../assets/images/bgimages/pro1.jpeg';
import bathImg from '../assets/images/bgimages/bathroom.jpeg';
import paveImg from '../assets/images/bgimages/elevation1.jpeg';
import livingImg from '../assets/images/bgimages/pro2.jpeg';

const designs = [
  { title: 'Room Designs', image: roomImg },
  { title: 'Bathroom Designs', image: bathImg },
  { title: 'Pavement Designs', image: paveImg },
  { title: 'Living Room Designs', image: livingImg },
];

export default function About() {
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
    <div className="page-wrapper about-page-wrapper">
      <Header />
      
      {/* Page Title */}
      <section className="page-title" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="auto-container">
          <h2 style={{color: "#000000"}}>About Us</h2>
          <ul className="bread-crumb clearfix">
            <li><Link to="/" style={{color: "#000000"}}>Home</Link></li>
            <li>About Us</li>
          </ul>
        </div>
      </section>
      
      {/* About Section */}
      <div className="reveal-on-scroll">
        <AboutPageOverview />
      </div>
      
      {/* Purpose & Value Section */}
      <div className="reveal-on-scroll">
        <PurposeValue />
      </div>

      {/* Shop By Room Designs Section */}
      <div className="reveal-on-scroll">
        <section className="room-designs-section">
          <div className="auto-container">
            <div className="sec-title centered">
              <div className="sec-title_title">
                <i className="flaticon-home" style={{ marginRight: '8px' }} />
                INSPIRATIONS
              </div>
              <h2 className="room-designs-heading" style={{ marginTop: '10px' }}>Shop By Room Designs</h2>
            </div>
            <div className="room-designs-grid">
              {designs.map((design) => (
                <Link to="/products" className="room-design-card" key={design.title}>
                  <div className="room-design-img-wrap">
                    <img src={design.image} alt={design.title} />
                  </div>
                  <div className="room-design-banner">
                    <span>{design.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      {/* Quick Collections Selection Tabs */}
      <div className="reveal-on-scroll">
        <ChooseTabSection />
      </div>
      
      <MapLocation />
      
      <Footer />
      <BackToTop />
    </div>
  );
}
