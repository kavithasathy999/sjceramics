import { FaHandshake, FaPalette, FaSeedling, FaShieldAlt, FaStar } from 'react-icons/fa';
import tilesIcon from '../assets/images/icons/tiles.png';
import pattern4 from '../assets/images/background/pattern-4.png';
import service6 from '../assets/images/resource/service-6.webp';
import service7 from '../assets/images/resource/service-7.webp';
import service8 from '../assets/images/resource/service-8.webp';
import service9 from '../assets/images/resource/service-9.webp';
import './WhyChoose.css';

const coreValues = [
  {
    title: 'Quality Without Compromise',
    icon: FaStar,
  },
  {
    title: 'Customer First',
    icon: FaHandshake,
  },
  {
    title: 'Trust & Integrity',
    icon: FaShieldAlt,
  },
  {
    title: 'Innovation & Design Excellence',
    icon: FaPalette,
  },
  {
    title: 'Partnership for Growth',
    icon: FaSeedling,
  },
];

export default function ServicesThree() {
  return (
    <section className="services-three">
      <div className="services-three_tiles-icon" style={{ backgroundImage: `url(${tilesIcon})` }} />
      <div className="services-three_pattern" style={{ backgroundImage: `url(${pattern4})` }} />
      <div className="auto-container">
        <div className="row clearfix">
          <div className="services-three_content-column col-lg-7 col-md-12 col-sm-12">
            <div className="services-three_content-outer">
              <div className="sec-title">
                <div className="sec-title_title"><i className="flaticon-wood-1" /> Our Core Values</div>
                <h2 className="sec-title_heading">Why Choose Us</h2>
                <div className="sec-title_text" style={{ textAlign: 'justify' }}>
                  At SJ Ceramics, we believe in quality without compromise, offering premium tiles,
                  sanitary ware, and bath fittings that deliver lasting beauty, durability, and value.
                  We put customers first through honest guidance, personalized solutions, and
                  exceptional service from selection to delivery. Built on trust and integrity, our
                  relationships are strengthened by transparent pricing, ethical practices, and
                  reliable commitments. By embracing innovation and design excellence, we bring the
                  latest products and inspiring ideas to help create beautiful living spaces. As a
                  proud KAG Channel Partner, we support homeowners, architects, builders, and
                  contractors with trusted brands, professional expertise, and dependable service.
                </div>
              </div>

              <ul className="services-three_highlights" aria-label="Core values summary">
                {coreValues.map(({ title, icon: Icon }) => (
                  <li className="services-three_highlight" key={title}>
                    <span className="services-three_highlight-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="services-three_images-column col-lg-5 col-md-12 col-sm-12">
            <div className="services-three_images-outer">
              <div className="services-three_tiles">
                <div className="services-three_tile"><img src={service6} alt="Premium tile sample" /></div>
                <div className="services-three_tile"><img src={service7} alt="Premium tile sample" /></div>
                <div className="services-three_tile"><img src={service8} alt="Premium tile sample" /></div>
                <div className="services-three_tile"><img src={service9} alt="Premium tile sample" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
