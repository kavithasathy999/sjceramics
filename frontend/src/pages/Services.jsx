import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import ServicesFive from '../components/ServicesFive';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import pageTitleBg from '../assets/images/background/24.jpg';
import headerBg from '../assets/images/background/14.jpg';

export default function Services() {
  return (
    <div className="page-wrapper">
      <Header variant="inner" bgImage={headerBg} />
      <PageTitle title="Our Services" bgImage={pageTitleBg} />
      <ServicesFive />
      <ContactSection />
      <Footer />
      <BackToTop />
    </div>
  );
}
