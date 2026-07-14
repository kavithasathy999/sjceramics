import tileTexture from '../assets/images/background/projects-tile-texture.png';
import allTiles from '../assets/images/brands/all_tiles.png';
import floorTiles from '../assets/images/brands/floor_tiles.png';
import wallTiles from '../assets/images/brands/wall_tiles.png';
import athangudiTiles from '../assets/images/brands/athangudi_tiles.png';
import sanitaryware from '../assets/images/brands/sanitaryware.png';
import flushTank from '../assets/images/brands/flush_tank.png';
import aquaFaucet from '../assets/images/brands/aqua_faucet.png';
import ptmtTaps from '../assets/images/brands/ptmt_taps.png';
import kitchenSink from '../assets/images/brands/kitchen_sink.png';
import adhesiveGrout from '../assets/images/brands/adhesive_grout.png';
import sanitaryGallery from '../assets/images/gallery/sanitary-ware-gallery-v2.png';
import bathFittingsGallery from '../assets/images/gallery/bath-fittings-gallery-v2.png';
import tileInstallation from '../assets/images/bgimages/tileinstall.jpg';
import './ProjectsOne.css';

const galleryItems = [
  { image: floorTiles, name: 'Premium Floor Tiles', category: 'Tiles', area: 'floor', position: 'center 64%' },
  { image: wallTiles, name: 'Decorative Wall Tiles', category: 'Tiles', area: 'wall', position: 'center' },
  { image: allTiles, name: 'Designer Tile Collection', category: 'Tiles', area: 'designer', position: 'center' },
  { image: athangudiTiles, name: 'Athangudi Heritage Tiles', category: 'Tiles', area: 'heritage', position: 'center' },
  { image: sanitaryGallery, name: 'Sanitary Ware Collection', category: 'Sanitary Wares', area: 'sanitary', position: 'center 58%' },
  { image: sanitaryware, name: 'Luxury Bathroom Suite', category: 'Sanitary Wares', area: 'suite', position: 'center' },
  { image: flushTank, name: 'Modern Flush Tank', category: 'Sanitary Wares', area: 'flush', position: 'center' },
  { image: bathFittingsGallery, name: 'Premium Bath Fittings', category: 'Bath Fittings', area: 'bath', position: '36% center' },
  { image: aquaFaucet, name: 'Chrome Basin Mixer', category: 'Bath Fittings', area: 'mixer', position: 'center' },
  { image: ptmtTaps, name: 'PTMT Designer Tap', category: 'Bath Fittings', area: 'tap', position: 'center' },
  { image: adhesiveGrout, name: 'Tile Adhesive & Grout', category: 'Others', area: 'grout', position: 'center' },
  { image: kitchenSink, name: 'Kitchen Sink Collection', category: 'Others', area: 'sink', position: 'center' },
  { image: tileInstallation, name: 'Professional Tile Installation', category: 'Others', area: 'install', position: 'center' },
];

export default function ProjectsOne() {
  return (
    <section
      className="project-showcase"
      style={{ '--project-tile-texture': `url(${tileTexture})` }}
      aria-labelledby="project-showcase-title"
    >
      <div className="project-showcase__container">
        <div className="sec-title centered project-showcase__heading">
          <div className="sec-title_title">
            <i className="flaticon-wood-1" /> Our Gallery
          </div>
          <h2 className="sec-title_heading" id="project-showcase-title">
            Explore Our Signature Collection
          </h2>
          <p>
            A curated gallery of surfaces, sanitaryware, fittings and essentials crafted for beautiful spaces.
          </p>
        </div>

        <div className="project-showcase__gallery">
          {galleryItems.map((item) => (
            <article
              className="project-showcase__gallery-item"
              key={item.name}
              style={{
                '--gallery-area': item.area,
                '--gallery-object-position': item.position,
              }}
            >
              <div className="project-showcase__image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="project-showcase__image-shade" aria-hidden="true" />
                <div className="project-showcase__product-copy">
                  <span className="project-showcase__product-category">{item.category}</span>
                  <h3>{item.name}</h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
