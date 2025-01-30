import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import instaLogo from './assets/instaLogo.png';
import tiktokLogo from './assets/tiktokLogo.png';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      {/* Footer */}
      <footer className="footer">
      <div className="logo-container">
        <div className="logo-item"> <p>SGA</p> <img src={instaLogo} alt="SGA"/> </div>
        <div className="logo-item"> <p>Campus Affairs</p> <img src={instaLogo} alt="Campus Affairs" /> </div>
        <div className="logo-item"> <p>SGA</p> <img src={tiktokLogo} alt="SGA" /> </div>
      </div>

        <p>Northeastern University Student Government Association 
        332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115
        Webmaster: sgaOperations@northeastern.edu
        Media Inquiries: sgaExternalAffairs@northeastern.edu</p>
      </footer>
    </>
  )
}

export default App
