import '../App.css';
import instaLogo from '../assets/instaLogo.png';
import tiktokLogo from '../assets/tiktokLogo.png';

function Footer() {
  return (
    <footer className="bg-black fixed bottom-0 left-0 w-full text-center">
      <div className="button-container flex justify-center items-center gap-10 my-3">
        <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">GIVE FEEDBACK</button>
        <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">MAILING LIST</button>
        <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">GET INVOLVED</button>
      </div>
      <div className="flex justify-center items-center gap-5 my-6">
        <div className="flex flex-col items-center mx-5">
          <p className="text-white font-light mb-3">SGA</p>
          <img src={instaLogo} alt="SGA" className="w-16 h-auto" />
        </div>
        <div className="flex flex-col items-center mx-5">
          <p className="text-white font-light mb-3">Campus Affairs</p>
          <img src={instaLogo} alt="Campus Affairs" className="w-16 h-auto" />
        </div>
        <div className="flex flex-col items-center mx-5">
          <p className="text-white font-light mb-3">SGA</p>
          <img src={tiktokLogo} alt="SGA" className="w-16 h-auto" />
        </div>
      </div>
      <div className="mb-10">
        <p className="text-white font-light mb-4">Northeastern University Student Government Association</p>
        <p className="text-white font-light mb-4">332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115</p>
        <p className="text-white font-light mb-4">Webmaster:&nbsp;  
          <a 
            href="mailto:sgaOperations@northeastern.edu" 
            className="underline text-white font-light hover:text-gray-300"
          >
            sgaOperations@northeastern.edu
          </a>
        </p>
        <p className="text-white font-light mb-4">Media Inquiries:&nbsp; 
          <a 
            href="mailto:sgaExternalAffairs@northeastern.edu" 
            className="underline text-white font-light hover:text-gray-300 transition duration-300"
          >
            sgaExternalAffairs@northeastern.edu
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer;