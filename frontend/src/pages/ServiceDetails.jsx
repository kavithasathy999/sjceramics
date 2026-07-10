import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import ServiceSidebar from '../components/ServiceSidebar';
import Accordion from '../components/Accordion';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import pageTitleBg from '../assets/images/background/24.jpg';
import headerBg from '../assets/images/background/14.jpg';
import serviceImg from '../assets/images/resource/service-20.jpg';
import serviceImgTwo from '../assets/images/resource/service-21.jpg';

const processSteps = [
  {
    title: 'Repair of all types of floor damages',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.',
  },
  {
    title: 'Installation of all types of flooring',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.',
  },
  {
    title: 'Service with minimal business interruption',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.',
  },
  {
    title: 'Professional and neat installation',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.',
  },
];

const featureList = [
  'Precise measurement of space',
  'Expert installation ensuring durability and aesthetics',
  'Personalized service catering to your preferences',
  'Offerings for all rooms',
];

export default function ServiceDetails() {
  return (
    <div className="page-wrapper">
      <Header variant="inner" bgImage={headerBg} />
      <PageTitle title="Services Detail" bgImage={pageTitleBg} />

      <div className="sidebar-page-container left-sidebar">
        <div className="auto-container">
          <div className="row clearfix">
            <div className="sidebar-side col-lg-4 col-md-12 col-sm-12">
              <ServiceSidebar />
            </div>

            <div className="content-side col-lg-8 col-md-12 col-sm-12">
              <div className="service-detail">
                <div className="service-detail_image">
                  <img src={serviceImg} alt="Floor installation" />
                </div>
                <h2 className="service-detail_title">Floor Installation</h2>
                <p>
                  This service includes the installation of a new floor, ensuring a polished and professional
                  finish. Our experts are adequately trained to install different flooring types, from hardwood
                  and laminate to ceramic tile and carpet. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse
                  ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
                </p>

                <div className="row clearfix">
                  <div className="column col-lg-8 col-md-8 col-sm-12">
                    <ul className="service-detail_list">
                      {featureList.map((feature) => (
                        <li key={feature}>
                          <i className="flaticon-checked" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo
                      viverra maecenas accumsan lacus vel facilisis.
                    </p>
                  </div>
                  <div className="column col-lg-4 col-md-4 col-sm-12">
                    <div className="service-detail_image-two">
                      <img src={serviceImgTwo} alt="Flooring detail" />
                    </div>
                  </div>
                </div>

                <h3 className="service-detail_subtitle">Our Flooring Installation Process</h3>
                <Accordion items={processSteps} />
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <ContactSection />
      <Footer />
      <BackToTop />
    </div>
  );
}
