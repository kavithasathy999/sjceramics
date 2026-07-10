import useInView from '../hooks/useInView';
import bg from '../assets/images/background/2.jpg';
import lineOne from '../assets/images/background/pattern-2.png';
import lineTwo from '../assets/images/background/pattern-3.png';
import service1 from '../assets/images/bgimages/tiling.jpg';
import service2 from '../assets/images/bgimages/painting.jpg';
import service3 from '../assets/images/bgimages/flooring.jpg';
import service4 from '../assets/images/bgimages/tileinstall.jpg';

const services = [
  { number: 1, title: 'Tiling & Concrete', image: service1, delay: 0 },
  { number: 2, title: 'Wall Painting', image: service2, delay: 150 },
  { number: 3, title: 'Industrial Flooring', image: service3, delay: 300 },
  { number: 4, title: 'Tile Installation', image: service4, delay: 450 },
];

function ServiceBlock({ service }) {
  const [ref, inView] = useInView();

  return (
    <div className="service-block_two col-xl-3 col-lg-6 col-md-6 col-sm-6">
      <div
        ref={ref}
        className={inView ? 'service-block_two-inner animated fadeInLeft' : 'service-block_two-inner'}
        style={{
          opacity: inView ? undefined : 0,
          animationDelay: `${service.delay}ms`,
          animationDuration: '1500ms',
        }}
      >
        <div className="service-block_two-image">
          <a href="#"><img src={service.image} alt={service.title} /></a>
        </div>
        <div className="service-block_two-content">
          <div className="service-block_two-number">{service.number}</div>
          <h4 className="service-block_two-title"><a href="#">{service.title}</a></h4>
          <a className="service-block_two-arrow" href="#"><i className="flaticon-up-right-arrow-1" /></a>
        </div>
      </div>
    </div>
  );
}

export default function ServicesTwo() {
  return (
    <section className="services-two">
      <div className="services-two_bg" style={{ backgroundImage: `url("https://themazine.com/html/fllopi/assets/images/background/2.jpg")` }} />
      <div className="services-two_line-one" style={{ backgroundImage: `url(${lineOne})` }} />
      <div className="services-two_line-two" style={{ backgroundImage: `url(${lineTwo})` }} />
      <div className="auto-container">
        <div className="sec-title light centered">
          <div className="sec-title_title"><i className="flaticon-wood-1" /> Our Process</div>
          <h2 className="sec-title_heading">A Seamless Journey <br /> To Your Dream Space</h2>
        </div>
        <div className="row clearfix">
          {services.map((service) => (
            <ServiceBlock service={service} key={service.number} />
          ))}
        </div>
      </div>
    </section>
  );
}
