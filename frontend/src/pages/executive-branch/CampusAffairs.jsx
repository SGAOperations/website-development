import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';

const CampusAffairs = () => {
  const leader = {
    name: 'Julian Herzing-Burkard',
    title: 'Vice President for Campus Affairs',
    image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/8f7e6b32-066b-4f27-8039-bcab851a0ee4/Julian+Herzing-Burkard.jpeg?format=2500w'
  }
  const members = [
    {
      name: 'Armaan Sarao', 
      title: 'Director of Campus Services',
      image: '' 
    },
    {
      name: 'Alexandra Vergara-Anglim',
      title: 'Director of Sustainability',
      image: ''
    },
    {
      name: 'Patricia Perez-Maldonado',
      title: 'Communication Manager',
      image: ''
    },
    {
      name: 'Isabella Heilbron',
      title: 'Communication Manager',
      image: ''
    },
    {
      name: 'Mason Simms',
      title: 'Chair of Campus Planning Advisory Board',
      image: ''
    },
    {
      name: 'Luis Sarmiento',
      title: 'Chair of Dining Advisory Board',
      image: ''
    },
    {
      name: 'Alex Mora',
      title: 'Chair of Green Initiatives Board',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/76694c69-59eb-4e66-99e3-842a3422304a/Alex+Mora.JPG?format=2500w'
    },
    // TODO: replace website image urls with downloaded image urls
  ]

  const committees = [
    {
      title: 'Campus Services Committee', 
      description: 'The Campus Services Committee works on a breadth of projects related to improving campus services and the physical campus experience for undergraduate students, including Campus Recreation & Facilities, Transportation, Public Safety and Off-Campus Housing. It is a bridge between the Northeastern student body and our campus facilities, administrative offices, and various student resources at Northeastern. The Campus Services Committee is open to all undergraduate students with no prior experience and no commitment necessary. If you are interested, just show up!',
      image: ''
    },
    {
      title: 'Sustainability Committee',
      description: 'The Sustainability Committee works to create, support, and implement sustainable practices and initiatives on campus and in the global Northeastern community. Taking an interdisciplinary approach, members work with other SGA divisions, student organizations, and administrative departments to best address the needs of students and to create a more sustainable campus. The Sustainability Committee is open to all undergraduate students with no prior experience and no commitment necessary. If you are interested, just show up!',
      image: ''
    },
    {
      title: 'Campus Planning Advisory Board',
      description: 'The Campus Planning Advisory Board (CPAB) officially represents student interests related to Northeastern University campus planning and development. We act as the liaison between the Northeastern Student Body, its campus space concerns and interests, and Northeastern’s Planning, Real Estate, and Facilities (PREF), making campus planning and development decisions. CPAB assists PREF with student outreach initiatives (such as tabling and focus groups), present and discusses student viewpoints and positions with PREF, and helps educate students on campus planning and development.',
      image: ''
    }
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

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Campus Affairs</div>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
          The Campus Affairs division serves as the advocacy body for undergraduate students on issues related to 
          campus dining, recreation, sustainability, development, transportation, safety, and facilities, among other 
          services essential to student life. The various committees and boards that fall within the division work 
          directly with Northeastern administration to ensure student voices are heard and represented in decisions made on 
          campus. If you have any questions, do not hesitate to reach out to sgaCampusAffairs@northeastern.edu.
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

        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Boards</h3>
        
      </div>
      <Footer />
    </>
  )
}

export default CampusAffairs;