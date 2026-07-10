import { Link } from 'react-router-dom';
import ctaBg from '../assets/images/background/1.jpg';
import ctaBall from '../assets/images/icons/ball-1.png';
import cta1 from '../assets/images/resource/cta-1.jpg';
import tile1 from '../assets/images/background/tileimage1.jpg'
import tile2 from '../assets/images/background/tileimage2.jpeg'
import cta2 from '../assets/images/resource/cta-2.jpg';

export default function CtaOne() {
  return (
    <section className="cta-one">
      <div className="cta-one_bg" style={{ backgroundImage: `url("https://themazine.com/html/fllopi/assets/images/background/1.jpg")` }} />
      <div className="cta-one_ball" style={{ backgroundImage: `url(${ctaBall})` }} />
      <div className="auto-container">
        <div className="row clearfix">
          <div className="cta-one_images-column col-lg-4 col-md-4 col-sm-12">
            <div className="cta-one_images-outer">
              <div className="cta-one_image">
                <img src={tile1} alt="Flooring installation" />
              </div>
              <div className="cta-one_image-two">
                <img src={tile2} alt="Interior painting" />
              </div>
            </div>
          </div>

          <div className="cta-one_content-column col-lg-8 col-md-8 col-sm-12">
            <div className="cta-one_content-outer">
              <h2 className="cta-one_title" style={{color: "#ffffff"}}>Best Internal Painting &amp; Flooring Solution</h2>
              <div className="cta-one_button">
                <Link to="/contact" className="theme-btn btn-style-three">
                  <span className="btn-wrap">
                    <span className="text-one">Get In Touch</span>
                    <span className="text-two">Get In Touch</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
