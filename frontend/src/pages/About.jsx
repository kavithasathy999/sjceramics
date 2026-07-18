import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Header from '../components/Header';
import FounderShowcaseSection from '../components/FounderShowcaseSection';
import AboutPageOverview from '../components/AboutPageOverview';
import PurposeValue from '../components/PurposeValue';
import MapLocation from '../components/MapLocation';
import ChooseTabSection from '../components/ChooseTabSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import bannerBg from '../assets/images/background/25.jpg';
import './About.css';

import roomImg from '../assets/images/bgimages/pro1.jpeg';
import bathImg from '../assets/images/bgimages/bathroom.jpeg';
import paveImg from '../assets/images/bgimages/elevation1.jpeg';
import livingImg from '../assets/images/bgimages/pro2.jpeg';
import elevationDesignImg from '../assets/images/bgimages/elevation-design-v2.png';
import parkingDesignImg from '../assets/images/bgimages/parking-design-v2.png';
import kitchenRoomDesignImg from '../assets/images/bgimages/kitchen-room-design-v2.png';

const designs = [
  {
    title: 'Room Designs',
    image: roomImg,
    applications: ['Living Room/Bedroom', 'Office/Commercial/Shop'],
  },
  {
    title: 'Bathroom Designs',
    image: bathImg,
    applications: [
      'Bathroom',
      'Bathroom/Dining',
      'Bathroom/Kitchen',
      'Bathroom/Toilet/Kitchen',
      'Outdoor/Bathroom',
    ],
  },
  {
    title: 'Pavement Designs',
    image: paveImg,
    applications: ['Parking/Driveway/Garage'],
  },
  {
    title: 'Living Room Designs',
    image: livingImg,
    applications: ['Living Room/Bedroom'],
  },
  {
    title: 'Elevation Designs',
    image: elevationDesignImg,
    applications: ['Elevation/Exterior'],
  },
  {
    title: 'Parking Designs',
    image: parkingDesignImg,
    applications: ['Parking/Driveway/Garage'],
  },
  {
    title: 'Kitchen Room Designs',
    image: kitchenRoomDesignImg,
    applications: ['Bathroom/Toilet/Kitchen', 'Bathroom/Kitchen'],
  },
];

export default function About() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const roomDesignsSwiperRef = useRef(null);

  const pauseRoomDesignsMarquee = (event) => {
    if (event.pointerType !== 'mouse') return;

    const swiper = roomDesignsSwiperRef.current;
    if (!swiper || swiper.destroyed || !swiper.autoplay.running) return;

    // Swiper 14 ignores pauseOnMouseEnter while a slide transition is active.
    // Preserve the rendered position before pausing the continuous transition.
    const currentTranslate = swiper.getTranslate();
    swiper.autoplay.pause();
    swiper.setTransition(0);
    swiper.setTranslate(currentTranslate);
    swiper.animating = false;
  };

  const resumeRoomDesignsMarquee = (event) => {
    if (event.pointerType !== 'mouse') return;

    const swiper = roomDesignsSwiperRef.current;
    if (!swiper || swiper.destroyed || !swiper.autoplay.paused) return;

    swiper.autoplay.resume();
  };

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

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);

    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => motionPreference.removeEventListener('change', updateMotionPreference);
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

      <FounderShowcaseSection />
      
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
            <div
              onPointerEnter={pauseRoomDesignsMarquee}
              onPointerLeave={resumeRoomDesignsMarquee}
            >
              <Swiper
                className="room-designs-swiper"
                modules={[A11y, Autoplay]}
                onSwiper={(swiper) => { roomDesignsSwiperRef.current = swiper; }}
                loop
                speed={prefersReducedMotion ? 450 : 5200}
                autoplay={prefersReducedMotion ? false : {
                  delay: 0,
                  disableOnInteraction: false,
                }}
                grabCursor
                watchSlidesProgress
                breakpoints={{
                  0: { slidesPerView: 1.18, spaceBetween: 14 },
                  480: { slidesPerView: 1.65, spaceBetween: 16 },
                  768: { slidesPerView: 2.5, spaceBetween: 20 },
                  1024: { slidesPerView: 3.25, spaceBetween: 22 },
                  1280: { slidesPerView: 4.15, spaceBetween: 24 },
                }}
                aria-label="Shop by room designs"
              >
                {designs.map((design) => (
                  <SwiperSlide key={design.title}>
                    <Link
                      to="/products"
                      state={{
                        filterCategory: 'applications',
                        filterValues: design.applications,
                        filterLabel: design.title,
                      }}
                      className="room-design-card"
                      aria-label={`Shop ${design.title}`}
                    >
                      <div className="room-design-img-wrap">
                        <img src={design.image} alt={design.title} loading="lazy" />
                      </div>
                      <div className="room-design-banner">
                        <span>{design.title}</span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
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
