import lamp from '../assets/images/icons/lamp-1.png';
import bg from '../assets/images/background/4.jpg';
import pattern9 from '../assets/images/background/pattern-9.png';
import team1 from '../assets/images/bgimages/person1.jpeg';
import team2 from '../assets/images/bgimages/person2.jpeg';
import team3 from '../assets/images/bgimages/person3.jpeg';
import team4 from '../assets/images/bgimages/person4.jpeg';

const team = [
  { image: team1, name: 'Lora Ulliser' },
  { image: team2, name: 'Robert David' },
  { image: team3, name: 'Joseph Paul' },
  { image: team4, name: 'Lora Ulliser' },
];

export default function TeamSection() {
  return (
    <section className="team-one">
      {/* <div className="team-one_lamp" style={{ backgroundImage: `url(${lamp})` }} /> */}
      <div className="team-one_bg" style={{ backgroundImage: `url("https://themazine.com/html/fllopi/assets/images/background/2.jpg")` }} />
      <div className="auto-container">
        <div className="sec-title light">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="left-box">
              <div className="sec-title_title"><i className="flaticon-wood-1" /> Our Team List</div>
              <h2 className="sec-title_heading">Explore Our <br /> Team Member’s</h2>
            </div>
            <div className="right-box">
              <div className="sec-title_text">
                Lorem ipsum dolor sit amet consectetur adipiscing sed do <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <div className="team-one_btn-box">
                <a className="team-one_btn" href="#">View all Team List</a>
              </div>
            </div>
          </div>
        </div>

        <div className="row clearfix">
          {team.map((member, index) => (
            <div className="team-block_one col-lg-6 col-md-12 col-sm-12" key={`${member.name}-${index}`}>
              <div className="team-block_one-inner">
                <div className="team-block_one-pattern" style={{ backgroundImage: `url(${pattern9})` }} />
                <div className="team-block_one-content">
                  <a href="#" className="team-block_one-share flaticon-share" />
                  <div className="team-block_one-image">
                    <a href="#"><img src={member.image} alt={member.name} /></a>
                  </div>
                  <h4 className="team-block_one-heading"><a href="#">{member.name}</a></h4>
                  <div className="team-block_one-designation">Head of Designer</div>
                  <div className="team-block_one-text">
                    Lorem ipsum dolor sit amet lorem consectetur adipiscing elit sed on the eiusmod tempor user profile details
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
