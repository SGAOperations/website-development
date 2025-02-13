import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';

const DiversityEquityInclusion = () => {
  const leader = {
    name: 'Christly Bright-Agindotan',
    title: 'Vice President for Diversity, Equity, & Inclusion',
    image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/4155f9b0-2b80-4217-a59e-66bcfbe1d57f/Christly+Bright-Agindotan.jpeg?format=2500w'
  }
  const members = [
    {
      name: 'Sanah Tokhi', 
      title: 'Assistant Vice President',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/4fdb9202-a5a7-4a95-a4cb-a2b31e5bc597/Sanah+Tokhi.png?format=2500w' 
    },
    {
      name: 'Jialin Yu',
      title: 'Administrative Coordinator',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/318e2974-3091-42ae-9c77-bb5725e7b5c0/Jialin+Yu.jpeg?format=2500w'
    },
    {
      name: 'Grace Clemente',
      title: 'Public Relations and Media Chair',
      image: ''
    },
    {
      name: 'Isamar Martinez',
      title: 'Community Outreach Coordinator',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/6028778c-9b82-481e-b640-ef65e616461e/Isamar+Headshot+-+SGA+Diversity%2C+Equity%2C+and+Inclusion.jpeg?format=2500w'
    },
    // TODO: replace website image urls with downloaded image urls
  ]

  
  const committees = [
    {
      title: 'Diversity, Equity, and Inclusion Committee', 
      description: 'The Diversity, Equity, and Inclusion Committee works on solving internal and external issues related to student diversity, equity, inclusion, accessibility, and belonging. Internally, the Committee works to cultivate an inclusive environment throughout SGA through equitable policies and practices. Externally, the Committee works with student organizations and cultural centers to address DEI concerns, fostering a supportive and equitable campus experience.',
      image: ''
    },
  ]

  return (
    <>
      {/* uncomment when bg image is implemented */}
      {/* <div className="absolute top-0 left-0 w-full z-20"> */}
        <Header />
      {/* </div> */}

      {/* <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[75%] overflow-hidden">
          <img 
            className="w-full h-full scale-200 transform origin-center"
            src="" />
        </div>
      </div> */}
      {/* bg image goes ^^^ */}

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Diversity, Equity, and Inclusion</div>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
        The Diversity, Equity, and Inclusion Division drives change by actively addressing both internal and external 
        DEI challenges. Through collaboration with a wide array of student organizations, cultural centers, and university 
        leadership, DEI aims to foster an inclusive environment that empowers every voice. A single dedicated committee 
        orchestrates these efforts, ensuring that the Division’s initiatives resonate across the campus community.
        </p>
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaCampusAffairs@northeastern.edu">sgaCampusAffairs@northeastern.edu</a></p>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            <Committes committes={committees}/>
          </div>
        </div>        
      </div>
      <Footer />
    </>
  )
}

export default DiversityEquityInclusion;