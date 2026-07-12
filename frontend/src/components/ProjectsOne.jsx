import { Link } from 'react-router-dom';
import tileTexture from '../assets/images/background/projects-tile-texture.png';
import allTiles from '../assets/images/brands/all_tiles.png';
import sanitaryware from '../assets/images/brands/sanitaryware.png';
import aquaFaucet from '../assets/images/brands/aqua_faucet.png';
import adhesiveGrout from '../assets/images/brands/adhesive_grout.png';
import './ProjectsOne.css';

const projects = [
  {
    image: allTiles,
    title: 'Tiles',
    filterValue: 'Tiles',
  },
  {
    image: sanitaryware,
    title: 'Sanitary Wares',
    filterValue: 'Sanitary Wares',
  },
  {
    image: aquaFaucet,
    title: 'Bath Fittings',
    filterValue: 'Bath Fittings',
  },
  {
    image: adhesiveGrout,
    title: 'Others',
    filterValue: 'Others',
  },
];

const filterState = (filterValue) => ({ filterCategory: 'category', filterValue });

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
            <i className="flaticon-wood-1" /> Our Collections
          </div>
          <h2 className="sec-title_heading" id="project-showcase-title">
            Designed for Every Space
          </h2>
          <p>
            Discover surfaces and bath essentials curated for considered, lasting interiors.
          </p>
        </div>

        <div className="project-showcase__grid">
          {projects.map((project) => (
            <article className="project-showcase__card" key={project.title}>
              <Link
                className="project-showcase__link"
                to="/products"
                state={filterState(project.filterValue)}
                aria-label={`Explore ${project.title}`}
              >
                <img src={project.image} alt={`${project.title} collection`} />
                <span className="project-showcase__category">{project.title}</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
