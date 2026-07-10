import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView';
import bg from '../assets/images/background/9.jpg';
import { services } from '../utils/ServiceData';

function ServiceCard({ service }) {
  const [ref, inView] = useInView();

  return (
    <div className="service-block_three col-lg-3 col-md-6 col-sm-6">
      <div
        ref={ref}
        className={inView ? 'service-block_three-inner animated fadeInLeft' : 'service-block_three-inner'}
        style={{
          opacity: inView ? undefined : 0,
          animationDelay: `${service.delay}ms`,
          animationDuration: '1500ms',
        }}
      >
        <div className="service-block_three-image">
          <Link to="/service-detail">
            <img src={service.image} alt={service.title} />
          </Link>
        </div>
        <div className="service-block_three-content">
          <div className={`service-block_three-icon ${service.icon}`} />
          <h4 className="service-block_three-title">
            <Link to="/service-detail">{service.title}</Link>
          </h4>
          <Link className="service-block_three-arrow" to="/service-detail">
            <i className="flaticon-next" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesFive() {
  return (
    <section className="services-five">
      <div className="services-five_bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="auto-container">
        <div className="row clearfix">
          {services.map((service) => (
            <ServiceCard service={service} key={service.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
