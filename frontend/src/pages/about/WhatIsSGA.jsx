import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function WhatIsSGA() {
  return (
    <div>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8">WHAT IS SGA?</div>
      <p className="text-center text-black mx-30 mt-6 mb-2 text-left">
        The Northeastern University Student Government Association (or SGA for short) is the representative body serving over 15,000 undergraduate students and to change our Boston campus for the better. We take on different projects and initiatives, write legislation, and advocate to members of the University administration to improve student life, classroom programs, and the overall Northeastern Boston campus undergraduate experience.
      </p>
      <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8">WHAT DOES SGA DO?</h3>
      <p className="text-black text-left ml-8 mt-6 mb-2">
      The Northeastern University Student Government Association (SGA) represents all Boston Campus undergraduate students, working to make Northeastern a better place for everyone. We take on projects, write legislation, and advocate to university administrators to improve student life, academics, and the overall Northeastern experience.
      <br></br>
      Our work falls into several categories:
        <ul className="list-disc pl-8 text-black text-left space-y-4 my-4">
          <li><b>Student Advocacy: </b>
          Collaborating with administrators to improve programs, policies, and practices that benefit students in dining, housing, academics, global experience, wellness, and school spirit.</li>
          <li><b>Events: </b>
          Planning and hosting educational forums and school spirit events such as hockey tailgates, Beanpot watch parties, Northeastern’s Got Talent, and more through our External Affairs Division.</li>
          <li><b>Student Organization Management and Funding: </b>
          Overseeing governance, approvals, compliance, and operations for all SGA-recognized student organizations on the Boston Campus and distributing the Student Activities Fee through the Student Involvement Division and Finance Board.</li>
          <li><b>SGA Operations: </b>
          Ensuring smooth SGA operations, including website management, student body elections, judicial hearings, communications, and more through the Office of the President, Operational Appeals Board, Elections Board, and other divisions.</li>
        </ul>
      No matter what you’re interested, there’s a place for you in SGA.
      </p>

      <div className="text-6xl mb-4 font-bold text-black text-center ml-8 uppercase">Our Partners</div>

      <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8">Northeastern University London Student Union</h3>
      <p className="text-black text-left ml-8 mt-6 mb-2">
        NUSU London is the student union representing undergraduate students on Northeastern’s London campus.
        (<a href="mailto:president@su.nulondon.ac.uk" className="text-red-500">president@su.nulondon.ac.uk</a>)
      </p>
      <a href="https://www.nchsu.org/">
        <button className="text-2xl bg-sga-red text-white font-bold rounded-lg hover:bg-sga-dark-red transition duration-300 mt-5 mb-5 ml-8">
          NUSU LONDON
        </button>
      </a>

      
      <h3 className="text-4xl font-bold text-sga-red text-left uppercase ml-8">Graduate Student Government</h3>
      <p className="text-black text-left ml-8 mt-6 mb-2">
      Graduate Student Government (GSG) is the student government representing all graduate students on across Northeastern’s global network.
        (<a href="GSG@northeastern.edu" className="text-red-500">GSG@northeastern.edu</a>)
      </p>
      <a href="https://gsg.sites.northeastern.edu/">
        <button className="text-2xl bg-sga-red text-white font-bold rounded-lg hover:bg-sga-dark-red transition duration-300 mt-5 mb-5">
          GSG
        </button>
      </a>




      <Footer />
    </div>
  );
}

//<div className="text-7xl mb-4 font-bold text-black text-center my-8">Heading</div>
//<h3 className="text-5xl font-bold text-black text-center">Subheading</h3>
//<p className="text-center text-black mx-30 mt-6 mb-2 text-left">text</p>