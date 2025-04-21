import '../App.css';
import React from "react";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../hooks/AuthContext";
import sgaLogo from '../assets/sga-logo.png';
import instaLogo from '../assets/instaLogo.png';
import tiktokLogo from '../assets/tiktokLogo.png';

function Footer() {
  const navigate = useNavigate(); 
  //const { user } = useAuth();

  const handleEditModeClick = () => {
    if (user) {
      navigate("/edit-mode");
    } else {
      navigate("/login");
    }
  };
  const goToEditMode = () => {
    navigate('/edit-mode');
  };

  return (
    <footer className="bg-black relative bottom-0 left-0 w-screen text-center overflow-hidden mx-0 px-0">
      <div className="button-container flex justify-center items-center pt-10">
        <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">GIVE FEEDBACK</button>
        <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">MAILING LIST</button>
        <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">GET INVOLVED</button>
      </div>
      <div className="flex justify-center items-center gap-5 py-6">
        <div className="flex flex-col items-center px-5">
          <p className="text-white font-light pb-3">SGA</p>
          <a href="https://www.instagram.com/northeasternsga/" target="_blank" rel="noopener noreferrer">
            <img src={instaLogo} alt="SGA" className="w-16 h-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </a>
        </div>
        <div className="flex flex-col items-center px-5">
          <p className="text-white font-light pb-3">Campus Affairs</p>
          <a href="https://www.instagram.com/sgacampusaffairs/" target="_blank" rel="noopener noreferrer">
            <img src={instaLogo} alt="Campus Affairs" className="w-16 h-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </a>
        </div>
        <div className="flex flex-col items-center px-5">
          <p className="text-white font-light pb-3">SGA</p>
          <a href="https://www.tiktok.com/@northeasternsga" target="_blank" rel="noopener noreferrer">
            <img src={tiktokLogo} alt="SGA" className="w-16 h-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </a>
        </div>
      </div>
      <div className="pb-10">
        <p className="text-white font-light pb-4">Northeastern University Student Government Association</p>
        <p className="text-white font-light pb-4">332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115</p>
        <p className="text-white font-light pb-4">Webmaster:&nbsp;  
          <a 
            href="mailto:sgaOperations@northeastern.edu" 
            className="underline text-white font-light hover:text-gray-300"
          >
            sgaOperations@northeastern.edu
          </a>
        </p>
        <p className="text-white font-light pb-4">Media Inquiries:&nbsp; 
          <a 
            href="mailto:sgaExternalAffairs@northeastern.edu" 
            className="underline text-white font-light hover:text-gray-300 transition duration-300"
          >
            sgaExternalAffairs@northeastern.edu
          </a>
        </p>
      </div>
      <div className="pt-6 mb-4">
        {/*edit mode navigation (will navigate to sign in page when implemented)*/} 
        <button 
          className="button bg-red-500 text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-red-500"
          onClick={goToEditMode} 
        >
          EDIT MODE
        </button>
      </div>
    </footer>
  );
}

export default Footer;