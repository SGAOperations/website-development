import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';

const StudentSuccess = () => {
  const leader = {
    name: 'Misha Ankudovych',
    title: 'Vice President for Student Success',
    image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/ed9937c7-3ffc-4776-aa0a-ce0f6d1b5886/Mikhail+Ankudovych.jpeg?format=2500w'
  }
  const members = [
    {
      name: 'Mia Netland', 
      title: 'Director of Wellness',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/93dd6c2c-db81-4e3b-ae34-1f23d7e81130/Mia+Netland.jpeg?format=2500w' 
    },
    {
      name: 'Charlene Chow',
      title: 'Director of Global Experience',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/9566da0a-7b77-4ecf-b452-703b52b79e18/Charlene+Chow.jpeg?format=2500w'
    },
    {
      name: 'Lindsay Hong',
      title: 'Director of Social Engagement',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/6117e163-531b-407e-8341-2400f5e3021e/Lindsay+Hong.jpg?format=2500w'
    },
    // TODO: replace website image urls with downloaded image urls
  ]

  const committees = [
    {
      title: 'Global Experience Committee',
      description: 'The Global Experience Committee focuses on advocating for student voices within the university\'s global network and works to address and improve the overall student experience across Northeastern\'s undergraduate global programs. Their objectives include enhancing student involvement, campus services, academics, and overall student success in all undergraduate global programs, collaborating with administrators and the student governments on the global campuses to bring positive change. The Global Experience Committee is open to all undergraduate students with no prior experience and no commitment necessary. If you are interested, just show up!',
      image: ''
    },
    {
      title: 'Wellness Committee',
      description: 'The Wellness Committee advocates for student well-being by working on mental and physical wellness projects. It is open to all undergraduate students, and no prior experience or commitment is necessary. If you are interested, just show up!',
      image: ''
    },
    {
      title: 'Student Engagement Committee',
      description: 'The Student Engagement Committee advocates for campus engagement by working on projects related to social integration, school spirit, athletics, the arts, and campus culture. The Student Engagement Committee is open to all undergraduate students with no prior experience and no commitment necessary. If you are interested, just show up!',
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

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Student Success</div>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
        The Student Success Division focuses on supporting the holistic well-being, global experiences, and campus 
        engagement of students. Through various committees and working groups, this Division advocates for mental 
        and physical wellness, improving global student experiences, and enhancing campus culture and student engagement.
        </p>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Division Leadership</h3>
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaStudentSuccess@northeastern.edu">sgaStudentSuccess@northeastern.edu</a></p>
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

export default StudentSuccess;