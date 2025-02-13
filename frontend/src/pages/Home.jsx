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
      <Footer />
    </div>
  );
}