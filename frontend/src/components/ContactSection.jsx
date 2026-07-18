import useFormState from '../hooks/useFormState';
import mapBg from '../assets/images/background/map.png';
import contactImg from '../assets/images/background/contact-floating-tile-ivory.png';
import contactImg2 from '../assets/images/background/contact-floating-tile-beige.png';
import ball from '../assets/images/icons/ball.png';

export default function ContactSection() {
  const { values, status, handleChange, handleSubmit } = useFormState({
    username: '',
    email: '',
    phone: '',
    message: '',
  });

  return (
    <section className="contact-one" style={{ '--contact-map-image': `url(${mapBg})` }}>
      <div className="contact-one_curve" />
      <div className="auto-container">
        <div className="inner-container">
          <div className="contact-one_image">
            <img src={contactImg} alt="Ivory marble ceramic tile" />
            <div className="contact-one_ball" style={{ backgroundImage: `url(${ball})` }} />
          </div>
          <div className="contact-one_image-two">
            <img src={contactImg2} alt="Beige stone ceramic tile" />
          </div>

          <div className="row clearfix">
            <div className="contact-one_info-column col-lg-5 col-md-12 col-sm-12">
              <div className="contact-one_info-outer">
                <h2 className="contact-one_title">Feel Free To Contact Us</h2>
                <ul className="contact-one_list">
                  <li>
                    <span className="flaticon-telephone" />
                    <strong>Call Anytime</strong>
                    <a href="tel:+919384105222" style={{ color: 'inherit' }}>+91 93841 05222</a> <br />
                    <a href="tel:04446560926" style={{ color: 'inherit' }}>044 46560926 (Landline)</a>
                  </li>
                  <li>
                    <span className="flaticon-pin" />
                    <strong>Address</strong>
                    107/2A, Medavakkam - Mambakkam Main Road, Mambakkam, Chennai, Tamil Nadu, India - 600127
                  </li>
                </ul>
                <div className="contact-one_phone">
                  <div className="contact-one_phone-inner">
                    <div className="side-icon flaticon-wood-1" />
                    <div className="icon flaticon-comment" />
                    Contact Emails <br />
                    <a href="mailto:sales@sjceramics.in">sales@sjceramics.in</a> <br />
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-one_form-column col-lg-7 col-md-12 col-sm-12">
              <div className="contact-one_form-outer">
                <div className="title-box">
                  <h3>Enquiry Form</h3>
                </div>

                <div className="default-form">
                  <form onSubmit={handleSubmit}>
                    <div className="row clearfix">
                      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <input
                          type="text"
                          name="username"
                          placeholder="Full Name*"
                          value={values.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email*"
                          value={values.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Mobile Number*"
                          value={values.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <textarea
                          name="message"
                          placeholder="Your Request"
                          value={values.message}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                        <button type="submit" className="theme-btn submit-btn">
                          {status === 'submitted' ? 'Request Sent!' : 'Send Request'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
