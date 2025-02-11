import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pictures from '../components/Pictures';

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
    // TODO: replace website image urls with downloaded image urls
  ]
  return (
    <>
      <Header />
      <div>
        <Pictures leader={leader} members={members}/>
      </div>
      <Footer />
    </>
  )
}

export default AcademicAffairs;