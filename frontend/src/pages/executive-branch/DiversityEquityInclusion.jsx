import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';

const DiversityEquityInclusion = () => {
  const leader = {
    name: '',
    title: '',
    image: ''
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
      <Header />
      <div>
        <Pictures leader={leader} members={members}/>
      </div>
      <Footer />
    </>
  )
}

export default DiversityEquityInclusion;