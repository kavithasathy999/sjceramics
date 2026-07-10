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
                <img src={aboutImg} alt="Interior flooring showcase" />
              </div>
              <div className="about-one_experiance">
                <div className="about-one_circle" style={{ backgroundImage: `url(${experienceIcon})` }} />
                <span style={{color: "#ffffff"}}>15</span>
              </div>
            </div>
          </div>

          <div className="about-one_content-column col-lg-6 col-md-12 col-sm-12">
            <div className="about-one_content-outer">
              <div className="sec-title">
                <div className="sec-title_title"><i className="flaticon-wood-1" /> About us</div>
                <h2 className="sec-title_heading">Best Flooring &amp; Painting Agency</h2>
                <div className="sec-title_text">
                  This esteemed level of status is only possible by the consistent implementation of the highest possible standards of service
                </div>
              </div>

              <div className="row clearfix">
                <div className="about-one_feature col-lg-6 col-md-6 col-sm-12">
                  <div className="about-one_feature-inner">
                    <div className="about-one_feature-icon flaticon-paving" />
                    Quality Flooring Services
                  </div>
                </div>
                <div className="about-one_feature col-lg-6 col-md-6 col-sm-12">
                  <div className="about-one_feature-inner">
                    <div className="about-one_feature-icon flaticon-tile" />
                    No1 Flooring <br /> Services
                  </div>
                </div>
              </div>

              <div className="about-one_text">
                We are a small Kent based company with over 15 years experience and have built a great reputation from our previous customers.
              </div>

              <div className="row clearfix">
                <div className="column col-lg-6 col-md-6 col-sm-12">
                  <ul className="about-one_list">
                    <li><i className="flaticon-checked-1" />Helpful staff</li>
                    <li><i className="flaticon-checked-1" />Community involvement</li>
                  </ul>
                </div>
                <div className="column col-lg-6 col-md-6 col-sm-12">
                  <ul className="about-one_list">
                    <li><i className="flaticon-checked-1" />Family-owned &amp; operated</li>
                    <li><i className="flaticon-checked-1" />Excellent relationships</li>
                  </ul>
                </div>
              </div>

              {showButton && (
                <div className="about-one_button">
                  <Link to="/about" className="theme-btn btn-style-one">
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
