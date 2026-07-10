import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import slide1 from '../assets/images/main-slider/slide-1.png';
import slide2 from '../assets/images/main-slider/slide-2.png';
import slide3 from '../assets/images/main-slider/slide-3.png';
import sliderImage from '../assets/images/main-slider/image-1.png';

const slides = [
  { 
    id: 1, 
    bg: slide1, 
    title: 'Modern Living', 
    heading: 'Premium Sanitary Wares for Elegant Spaces' 
  },
  { 
    id: 2, 
    bg: slide2, 
    title: 'Luxury Defined', 
    heading: 'Discover the Finest Bath Fittings' 
  },
  { 
    id: 3, 
    bg: slide3, 
    title: 'Flawless Designs', 
    heading: 'Exclusive Collection of High-Quality Tiles' 
  },
];

export default function HeroSlider() {
  return (
    <section className="slider-one">
      <div className="slider-one_phone" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)' }}>
        <a href="tel:+044-465-60926">
          <i className="flaticon-call" />
          (044) 465-60926
        </a>
      </div>

      <div className="main-slider swiper-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop
          speed={1000}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          navigation={{ nextEl: '.main-slider-next', prevEl: '.main-slider-prev' }}
          pagination={{ el: '.slider-one_pagination', clickable: true }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="swiper-slide" style={{ 
                backgroundImage: `url(${slide.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '88vh'
              }}>
                <div className="auto-container">
                  <div className="row clearfix">
                    <div className="slider-one_content col-xl-9 col-lg-7 col-md-12 col-sm-12">
                      <div className="slider-one_content-inner">
                        <div className="slider-one_title" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' }}>{slide.title}</div>
                        <h1 className="slider-one_heading" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9)' }}>{slide.heading}</h1>
                        <div className="slider-one_button">
                          <Link to="/products" className="theme-btn btn-style-two">
                            <span className="btn-wrap">
                              <span className="text-one font-bold">View Our Products</span>
                              <span className="text-two">View Our Products</span>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="slider-one_image-column col-xl-3 col-lg-5 col-md-12 col-sm-12">
                      <div className="slider-one_image">
                        <div className="title-one">Top Quality</div>
                        <div className="title-two">Premium Collection</div>
                        <img src={`http://themazine.com/html/fllopi/assets/images/main-slider/image-1.png`} alt="Marble floor tile" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="slider-one_arrows">
          <div className="main-slider-prev"><i className="flaticon-left-arrow" /></div>
          <div className="main-slider-next"><i className="flaticon-next-1" /></div>
        </div>

        <div className="slider-one_pagination" />
      </div>
    </section>
  );
}
