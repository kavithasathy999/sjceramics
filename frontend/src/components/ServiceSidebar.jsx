import pattern15 from '../assets/images/background/pattern-15.png';
import contactWidgetImg from '../assets/images/resource/contact-widget.jpg';
import { serviceSidebarLinks } from '../utils/ServiceData';

export default function ServiceSidebar() {
  return (
    <aside className="sidebar">
      {/* Service Widget */}
      <div className="sidebar-widget service-widget">
        <div className="widget-content">
          <ul className="service-list">
            {serviceSidebarLinks.map((label) => (
              <li key={label}><a href="#">{label}</a></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contact Widget */}
      <div className="sidebar-widget contact-widget">
        <div className="widget-content" style={{ backgroundImage: `url(${pattern15})` }}>
          <div className="image" style={{ backgroundImage: `url(${contactWidgetImg})` }} />
          <div className="title">Contact</div>
          <a className="phone" href="tel:+8801268324">880-126-8324</a>
          <div className="icon flaticon-telephone" />
        </div>
      </div>
    </aside>
  );
}
