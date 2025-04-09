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
      <div className="mb-10">
        <RollingGallery autoplay={true} pauseOnHover={true} />
      </div>
      <p className="text-center text-black mx-30 mt-6 mb-2">
      The Northeastern University Student Government Association (or SGA for short) is the representative body 
      serving over 15,000 undergraduate students and to change our Boston campus for the better. We take on 
      different projects and initiatives, write legislation, and advocate to members of the University administration 
      to improve student life, classroom programs, and the overall Northeastern Boston campus undergraduate experience.
      <br></br><br></br>
      We are run by students for students. Your success at Northeastern is central to our mission, and we are always 
      seeking new ways and ideas to improve the Husky experience.
      </p>
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">JOIN OUR SLACK!</h3>
      <p className="text-center text-black mx-30 mt-6 mb-2">
      Get the most up-to-date information about division initiatives, committee meetings, and more. 
      </p>
      <a href="https://neusga.slack.com/ssb/redirect">
        <button className="text-2xl bg-sga-red text-white font-bold py-6 px-100 rounded-lg hover:bg-sga-dark-red transition duration-300 mb-5">
          Join SGA Slack
        </button>
      </a>
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">100 YEARS OF IMPACT</h3>

      <Footer />
    </div>
  );
}