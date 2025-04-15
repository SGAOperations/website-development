import Header from '../components/Header';
import RollingGallery from '../blocks/Components/RollingGallery/RollingGallery.jsx';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[75%] overflow-hidden">
          <iframe 
            className="w-full h-full scale-200 pointer-events-none transform origin-center"
            src="https://www.youtube.com/embed/xQSHCjnSL6U?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=xQSHCjnSL6U"
            title="YouTube Video"
            allow="autoplay; fullscreen"
            // playsInline
          ></iframe>
        </div>
      </div>

      <div style={{ marginTop: '-160px' }} className="mb-8">
        <h2 className="text-7xl mb-4 font-bold text-sga-red text-center">Northeastern University</h2>
        <h3 className="text-5xl font-bold text-black text-center">Student Government Association</h3>
      </div>
      <p className="text-center text-black mx-30 mt-6 mb-2 text-left">
      The Northeastern University Student Government Association (or SGA for short) is the representative body 
      serving over 15,000 undergraduate students and to change our Boston campus for the better. We take on 
      different projects and initiatives, write legislation, and advocate to members of the University administration 
      to improve student life, classroom programs, and the overall Northeastern Boston campus undergraduate experience.
      <br></br><br></br>
      We are run by students for students. Your success at Northeastern is central to our mission, and we are always 
      seeking new ways and ideas to improve the Husky experience.
      </p>
      <div className="mb-10">
        <RollingGallery autoplay={true} pauseOnHover={true} />
      </div>
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">JOIN OUR SLACK!</h3>
      <p className="text-center text-black mx-30 mt-6 mb-2">
      Get the most up-to-date information about division initiatives, committee meetings, and more. 
      </p>
      <a href="https://neusga.slack.com/ssb/redirect">
        <button className="text-2xl bg-sga-red text-white font-bold py-6 px-100 rounded-lg hover:bg-sga-dark-red transition duration-300 mt-5 mb-5">
          Join SGA Slack
        </button>
      </a>
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">100 YEARS OF IMPACT</h3>
      <p className="text-center text-black mx-30 mt-6 mb-2">
      This year, the Student Government Association (SGA) at Northeastern University proudly celebrates its 
      100th anniversary. For a century, SGA has been at the forefront of championing student interests, advocating 
      for positive changes, and fostering a vibrant campus community. Our journey has been marked by significant 
      accomplishments and dedicated efforts to improve the Northeastern experience for all students.
      <br></br><br></br>
      <b className="text-2xl font-bold">Here are some of our most major recent accomplishments:</b>
      </p>

      <div className="mb-10">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/2 p-4">
            <ul className="list-disc pl-8 text-black text-left space-y-2">
              <li>Created and Implemented Wellness Days</li>
              <li>Created TRACE Course Evaluations</li>
              <li>Developed Swipe2Care Meal Donation Program</li>
              <li>Revised the 2024 Meal Plan</li>
              <li>Passed Referendum to Improve SafeZone App</li>
              <li>Passed Referendum for Off-Campus Gym Subsidies</li>
              <li>Passed Referendum to Limit Single-Use Plastic Water Bottles</li>
              <li>Hosted Annual Sustainability Events</li>
              <li>Conducted Bike Blitz for Parking Improvements</li>
              <li>Open Space Tabling & Focus Groups for Student Spaces</li>
              <li>Established Relationships with London & Oakland Student Governments</li>
              <li>Explored Pathways for Boston Orgs on Global Campuses</li>
              <li>Updated SGA Documents for Northeastern Global Network</li>
              <li>Passed Legislation for UHCS Medical Abortion Readiness Plan</li>
              <li>Organized NARCAN Training & COVID Info Distribution for Wellness Week 2024</li>
              <li>Hosted SGA 100-Year Celebration & Engaged Alumni</li>
              <li>Launched Campus Affairs Instagram for Initiative Updates</li>
            </ul>
          </div>
          <div className="w-full sm:w-1/2 p-4">
            <ul className="list-disc pl-8 text-black text-left space-y-2">
              <li>Hosted Large School Spirit Events (e.g., Beanpot Watch Party)</li>
              <li>Created Senator Name Pronunciation Form</li>
              <li>Conducted DEI Training & Census for SGA Members</li>
              <li>Ran Winter Clothing Drive with First Generation Low-Income Student Union</li>
              <li>Developed Attendance Manager for Senate Membership</li>
              <li>Transitioned SGA to Slack for Internal Communication</li>
              <li>Created Purchase Form for Budget Tracking</li>
              <li>Launched Global Club Pairing Program (6 London-Boston, 12 Oakland-Boston)</li>
              <li>Developed DEI & Organizational Resource Guides</li>
              <li>Created Student Organization Policy Manual & Template Constitution</li>
              <li>Reviewed 260 Organization Constitutions</li>
              <li>Restructured Student Involvement Board</li>
              <li>Investigated 60 Policy Breach Complaints</li>
              <li>Created Investigation Guidelines</li>
              <li>Guided 12 Orgs Through Preliminary Recognition Process</li>
              <li>Guided 53 Orgs Through Tentative Recognition, 37 Fully Recognized</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}