import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import { fetchData } from '../../api/api';

const OfficeOfThePresident = () => {
  const [pageData, setPageData] = useState({
    leader: { name: '', title: '', pictureUrl: '' },
    members: [],
    committees: [],
    boards: [],
    workingGroups: []
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData('Office of the President');
        setPageData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } 
    };

    getData();
  }, []);

  return (
    <>
      {/* uncomment when bg image is implemented */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[75%] overflow-hidden">
          <img 
            className="w-full scale-100 transform origin-center"
            src="https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/1604528719911-HAR17AA5QU2UNF4772WB/campus_update_09.jpg?format=2500w%202500w" />
        </div>
      </div>
      {/* bg image goes ^^^ */}

      <div style={{ marginTop: '-120px' }} className="text-7xl mb-4 font-bold text-black text-center my-8">Office of the President</div>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
        The Office of the President consists of the Student Body President and the Executive Vice President, 
        both of which are elected by the undergraduate student body. 
        The Office of the President is responsible for organizing the entire Student Government Association. This 
        includes executing all policies and objectives of the Association and overseeing external communications 
        with the community bodies and Boston-area student governance bodies. Additionally, the EVP serves to assist 
        the President in long-term planning, special projects, and initiatives and oversees the Association’s internal 
        communications, all Senate communications, events, archives, fundraising, and alumni connections.
        </p>
        
        <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaPresident@northeastern.edu">sgaPresident@northeastern.edu </a></p>
        <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaEVP@northeastern.edu ">sgaEVP@northeastern.edu</a></p>
        
        <div className="flex justify-center">
          <div>
            <Pictures leader={pageData.leader} members={pageData.members}/>
          </div>
        </div>
      </div>


      <Footer />
    </>
  )
}

export default OfficeOfThePresident;