import { Link } from 'react-router-dom';
import ball from '../assets/images/icons/ball.png';
import lamp from '../assets/images/icons/lamp.png';
import aboutImg from '../assets/images/resource/about1.png';
import experienceIcon from '../assets/images/icons/experiance.png';

export default function AboutSection({ showButton = true }) {
  return (
    <section className="about-one">
      <div className="about-one_ball" style={{ backgroundImage: `url(${ball})` }} />
      <div className="about-one_lamp" style={{ backgroundImage: `url(${lamp})` }} />
      <div className="auto-container">
        <div className="row clearfix">
          <div className="about-one_image-column col-lg-6 col-md-12 col-sm-12">
            <div className="about-one_image-outer">
              <div className="about-one_image">
                <img src={aboutImg} alt="Premium tiles &amp; sanitary ware showcase" />
              </div>
              <div className="about-one_experiance">
                {/* <div className="about-one_circle" style={{ backgroundImage: `url(${experienceIcon})` }} /> */}
                {/* <span style={{color: "#ffffff"}}>KAG</span> */}
              </div>
            </div>
          </div>

          <div className="about-one_content-column col-lg-6 col-md-12 col-sm-12">
            <div className="about-one_content-outer">
              <div className="sec-title">
                <div className="sec-title_title"><i className="flaticon-wood-1" /> About us</div>
                <h2 className="sec-title_heading">Premium Tiles, Sanitarywares &amp; Bath Fittings</h2>
                <div className="sec-title_text">
                  We are your one-stop destination for premium tiles, sanitary wares, and luxurious bath fittings, offering high-quality products directly from KAG's exclusive collections.
                </div>
              </div>

              <div className="row clearfix">
                <div className="about-one_feature col-lg-6 col-md-6 col-sm-12">
                  <div className="about-one_feature-inner">
                    <div className="about-one_feature-icon flaticon-paving" />
                    Genuine Tiles Collections
                  </div>
                </div>
                <div className="about-one_feature col-lg-6 col-md-6 col-sm-12">
                  <div className="about-one_feature-inner">
                    <div className="about-one_feature-icon flaticon-tile" />
                    Premium Sanitaryware &amp; <br /> Bath Fittings
                  </div>
                </div>
              </div>

              <div className="about-one_text">
                We are a premier startup showroom in Chennai and a proud authorized channel partner of KAG, a brand renowned for over 25 years of industry-leading excellence. We specialize in supplying high-quality floor and wall tiles as our primary offering, along with premium sanitary wares, elegant bath fittings, and other building ceramics directly from KAG's trusted catalog.
              </div>

              <div className="row clearfix">
                <div className="column col-lg-6 col-md-6 col-sm-12">
                  <ul className="about-one_list">
                    <li><i className="flaticon-checked-1" />Wide Range of KAG Designs</li>
                    <li><i className="flaticon-checked-1" />Premium Sanitary &amp; Fittings</li>
                  </ul>
                </div>
                <div className="column col-lg-6 col-md-6 col-sm-12">
                  <ul className="about-one_list">
                    <li><i className="flaticon-checked-1" />Direct Channel Pricing</li>
                    <li><i className="flaticon-checked-1" />Expert Product Guidance</li>
                  </ul>
                </div>
              </div>

              {showButton && (
                <div className="about-one_button">
                  <Link to="/about" className="theme-btn btn-style-one" style={{ borderRadius: '4px', padding: '16px 22px' }}>
                    <span className="btn-wrap">
                      <span className="text-one">More About us</span>
                      <span className="text-two">More About us</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
