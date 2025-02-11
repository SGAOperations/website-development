import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';

const CampusAffairs = () => {
  const leader = {
    name: 'Julian Herzing-Burkard',
    title: 'Vice President for Campus Affairs',
    image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/8f7e6b32-066b-4f27-8039-bcab851a0ee4/Julian+Herzing-Burkard.jpeg?format=2500w'
  }
  const members = [
    {
      name: '', 
      title: '',
      image: '' 
    },
    {
      name: '',
      title: '',
      image: ''
    },
    // TODO: replace website image urls with downloaded image urls
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
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CampusAffairs;