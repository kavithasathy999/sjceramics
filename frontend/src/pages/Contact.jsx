import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import bannerBg from '../assets/images/background/bathroom_banner.png';
import './Contact.css';

export default function Contact() {
  return (
    <div className="page-wrapper contact-page-wrapper">
      <Header />
      
      {/* Page Title */}
      <section className="page-title" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="auto-container">
          <h2 style={{color: "#000000"}}>Contact Us</h2>
          <ul className="bread-crumb clearfix">
            <li><Link to="/" style={{color: "#000000"}}>Home</Link></li>
            <li>Contact Us</li>
          </ul>
        </div>
      </section>
      
      {/* Contact Section */}
      <ContactSection />
      
      <Footer />
      <BackToTop />
    </div>
  );
}
