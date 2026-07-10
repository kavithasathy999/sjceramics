import bg from '../assets/images/background/3.jpg';
import pattern5 from '../assets/images/background/pattern-5.png';
import gallery1 from '../assets/images/bgimages/bathroom.jpeg';
import gallery2 from '../assets/images/bgimages/elevation1.jpeg';
import gallery3 from '../assets/images/bgimages/staircase.jpeg';
import gallery4 from '../assets/images/bgimages/last.jpeg';

const projects = [
  { image: gallery1, label: 'Wallpapers', title: 'Room Wallpapers' },
  { image: gallery2, label: 'Flooring', title: 'Tile From Paint' },
  { image: gallery3, label: 'Painting', title: 'Wall Painting' },
  { image: gallery4, label: 'Field Tile', title: 'Kendal Slate' },
];

export default function ProjectsOne() {
  return (
    <section className="projects-one">
      <div className="projects-one_bg" style={{ backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8y7hFHK_5FKWpHdXlTt80r4sk2oW-RCY2DSfMBwc9QqfoMZoW2oIBScs&s=10")` }} />
      <div className="auto-container">
        <div className="sec-title light centered">
          <div className="sec-title_title"><i className="flaticon-wood-1" /> Services</div>
          <h2 className="sec-title_heading">Best Interior Services <br /> That We Provide</h2>
        </div>
        <div className="row clearfix">
          {projects.map((project) => (
            <div className="projects-block_one col-lg-3 col-md-6 col-sm-6" key={project.title}>
              <div className="projects-block_one-inner">
                <div className="projects-block_one-image">
                  <a href="#"><img src={project.image} alt={project.title} /></a>
                </div>
                <a className="projects-block_one-arrow" href="#"><i className="flaticon-up-right-arrow-1" /></a>
                <div className="projects-block_one-content" style={{ backgroundImage: `url(${pattern5})` }}>
                  <div className="projects-block_one-title">{project.label}</div>
                  <h4 className="projects-block_one-heading"><a href="#">{project.title}</a></h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
