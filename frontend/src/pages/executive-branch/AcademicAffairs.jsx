import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';

const AcademicAffairs = () => {
  const leader = {
    name: 'Devyani Anand',
    title: 'Vice President for Academic Affairs',
    image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/c78acba7-ca19-457c-8c4d-1df2451316cb/Devyani+Anand.jpg?format=2500w'
  }
  const members = [
    {
      name: 'Quella Wang', 
      title: 'Curriculum Committee Representative',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/07681b43-eb1c-4245-be7f-2e5c9adcbbc0/Quella+Wang.jpeg?format=2500w' 
    },
    {
      name: 'Ada Spiwak',
      title: 'Faculty Senate Representative',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/7a50538e-5f0c-45c8-8769-3916e083bc19/Ada+Spiwek.jpg?format=2500w'
    },
    {
      name: 'Veer Dave',
      title: 'Assistant Vice President for Academic Affairs',
      image: ''
    },
    // TODO: replace website image urls with downloaded image urls
  ]

  const committees = [
    {
      title: 'Academic Affairs Committee', 
      description: 'The academic affairs committee focuses on all projects within the division. Our goal is to collaborate with all colleges as well as other SGA committees to work on university wide initiatives.',
      image: 'https://law.northeastern.edu/wp-content/uploads/2021/02/16x9-Students1.jpg'
    },
    {
      title: 'Sustainability Committee',
      description: 'The Sustainability Committee works to create, support, and implement sustainable practices and initiatives on campus and in the global Northeastern community. Taking an interdisciplinary approach, members work with other SGA divisions, student organizations, and administrative departments to best address the needs of students and to create a more sustainable campus. The Sustainability Committee is open to all undergraduate students with no prior experience and no commitment necessary. If you are interested, just show up!',
      image: 'https://damore-mckim.northeastern.edu/wp-content/uploads/2021/04/Sustainability-1680x705-1-1680x705.jpg'
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

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Academic Affairs</div>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
          The Academic Affairs division advocates for student needs related to academic services and practices. 
          It connects students, faculty, and administration on all academic matters, including close collaboration with the faculty senate and the provost's office. 
          Our goal is to continually enhance the academic experience at Northeastern by evolving and adapting to new ideas and changes.
        </p>
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>

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

export default AcademicAffairs;