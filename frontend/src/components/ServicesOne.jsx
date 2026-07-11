import ball from '../assets/images/icons/ball.png';
import pattern1 from '../assets/images/background/pattern-1.png';

const services = [
  {
    icon: 'flaticon-floor',
    title: 'Tiles And Flooring',
    text: 'Whether you’re looking for new carpet in your family home, commercial building or investment property',
  },
  {
    icon: 'flaticon-tiles',
    title: 'On Time & On Budget…',
    text: 'Whether you’re looking for new carpet in your family home, commercial building or investment property',
  },
  {
    icon: 'flaticon-punctuality',
    title: (
      <>
        Free <br /> Estimate
      </>
    ),
    text: 'Whether you’re looking for new carpet in your family home, commercial building or investment property',
  },
];

export default function ServicesOne() {
  return (
    <section className="services-one">
      <div className="services-one_bg" style={{ backgroundImage: `url(${ball})` }} />
      <div className="auto-container">
        <div className="row clearfix">
          {services.map((service) => (
            <div className="service-block_one col-lg-4 col-md-6 col-sm-6" key={service.icon}>
              <div className="service-block_one-inner" style={{ backgroundImage: `url(${pattern1})` }}>
                <div className="service-block_one-upper">
                  <div className={`service-block_one-icon ${service.icon}`} />
                  <h4 className="service-block_one-heading"><a href="#">{service.title}</a></h4>
                </div>
                <div className="service-block_one-text">{service.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
