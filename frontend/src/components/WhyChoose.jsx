import SkillBar from './SkillBar';
import tilesIcon from '../assets/images/icons/tiles.png';
import pattern4 from '../assets/images/background/pattern-4.png';
import service5 from '../assets/images/bgimages/leftimage.png';
import service6 from '../assets/images/resource/service-6.webp';
import service7 from '../assets/images/resource/service-7.webp';
import service8 from '../assets/images/resource/service-8.webp';
import service9 from '../assets/images/resource/service-9.webp';

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
                <div className="sec-title_title"><i className="flaticon-wood-1" /> Why Choose Us</div>
                <h2 className="sec-title_heading">We Offer Premium Tiles, Sanitary Wares &amp; Bath Fittings</h2>
                <div className="sec-title_text">
                  We specialize in supplying high-quality floor and wall tiles as our primary offering, along with premium sanitary wares, elegant bath fittings, and other building ceramics directly from KAG's trusted catalog.
                </div>
              </div>

              <div className="default-skills">
                <div className="row clearfix">
                  <SkillBar title="Premium Tiles Collection" percent={95} />
                  <SkillBar title="Sanitary &amp; Bath Fittings" percent={90} />
                </div>
              </div>

              <div className="row clearfix">
                <div className="services-three_feature col-lg-6 col-md-6 col-sm-12">
                  <div className="services-three_feature-inner">
                    <div className="services-three_feature-icon flaticon-tile" />
                    Luxurious &amp; Durable <br /> Tiles Collection
                  </div>
                </div>
                <div className="services-three_feature col-lg-6 col-md-6 col-sm-12">
                  <div className="services-three_feature-inner">
                    <div className="services-three_feature-icon flaticon-paving" />
                    Premium Sanitary &amp; <br /> Bath Fittings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="services-three_images-column col-lg-5 col-md-12 col-sm-12">
            <div className="services-three_images-outer">
              <div className="services-three_image">
                <img src={service5} alt="Sanitary wares and tiles showcase" />
              </div>
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
