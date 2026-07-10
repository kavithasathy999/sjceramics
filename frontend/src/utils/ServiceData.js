import service12 from '../assets/images/resource/service-12.jpg';
import service13 from '../assets/images/resource/service-13.jpg';
import service14 from '../assets/images/resource/service-14.jpg';
import service15 from '../assets/images/resource/service-15.jpg';
import service16 from '../assets/images/resource/service-16.jpg';
import service17 from '../assets/images/resource/service-17.jpg';
import service18 from '../assets/images/resource/service-18.jpg';
import service19 from '../assets/images/resource/service-19.jpg';

// Mirrors the 8 "Service Block Three" cards in the original services.html.
// In the source template every card links to the same static
// service-detail.html page, so each entry here routes to the single
// `/service-detail` page too - no invented per-service content.
export const services = [
  { icon: 'flaticon-tiles-1', title: 'Tiling & Concrete', image: service12, delay: 0 },
  { icon: 'flaticon-paint-roller', title: 'Wall Painting', image: service13, delay: 150 },
  { icon: 'flaticon-stone', title: 'Flooring & Wallpaper', image: service14, delay: 300 },
  { icon: 'flaticon-carpet', title: 'Carpets & Rugs', image: service15, delay: 450 },
  { icon: 'flaticon-wood', title: 'Residential Flooring', image: service16, delay: 0 },
  { icon: 'flaticon-floor', title: 'Laminate', image: service17, delay: 150 },
  { icon: 'flaticon-tiles-2', title: 'Tile Floor', image: service18, delay: 300 },
  { icon: 'flaticon-material', title: 'Floor Carpet', image: service19, delay: 450 },
];

// Sidebar quick-links shown on the Service Detail page's "service-widget".
export const serviceSidebarLinks = [
  'Floor Installation',
  'Floor Repair',
  'Wallpapering',
  'Carpets & Rugs',
  'Vein Patterns',
  'Laminate',
  'Residential Flooring',
];
