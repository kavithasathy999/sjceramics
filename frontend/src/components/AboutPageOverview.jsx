import ball from '../assets/images/icons/ball.png';
import lamp from '../assets/images/icons/lamp.png';
import aboutImg from '../assets/images/resource/about1.png';

export default function AboutPageOverview() {
  return (
    <section className="about-one">
      <div className="about-one_ball" style={{ backgroundImage: `url(${ball})` }} />
      <div className="about-one_lamp" style={{ backgroundImage: `url(${lamp})` }} />
      <div className="auto-container">
        <div className="row clearfix">
          <div className="about-one_image-column col-lg-6 col-md-12 col-sm-12">
            <div className="about-one_image-outer">
              <div className="about-one_image">
                <img src={aboutImg} alt="Premium tiles and sanitary ware showcase" />
              </div>
              <div className="about-one_experiance" />
            </div>
          </div>

          <div className="about-one_content-column col-lg-6 col-md-12 col-sm-12">
            <div className="about-one_content-outer">
              <div className="sec-title">
                <div className="sec-title_title"><i className="flaticon-wood-1" /> About us</div>
                <h2 className="sec-title_heading">Premium Tiles, Sanitarywares &amp; Bath Fittings</h2>
                <div className="sec-title_text">
                  We are your one-stop destination for premium tiles, sanitary wares, and luxurious
                  bath fittings, offering high-quality products directly from KAG&apos;s exclusive collections.
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
                    Sanitaryware &amp; <br /> Bath Fittings
                  </div>
                </div>
              </div>

              <div className="about-one_text">
                As a premier showroom and authorized KAG channel partner in Chennai, we supply
                premium floor and wall tiles, sanitaryware, elegant bath fittings, and building
                ceramics directly from KAG&apos;s trusted 25-year industry-leading catalog.
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
