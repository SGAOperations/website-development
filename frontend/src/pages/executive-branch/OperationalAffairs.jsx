import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committees from '../../components/Committees';
import { fetchData } from '../../api/api';

const OperationalAffairs = () => {
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
        const data = await fetchData('Operational Affairs');
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

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Operational Affairs</div>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
        The Division of Operational Affairs is the cornerstone of internal management within SGA, 
        responsible for maintaining up-to-date records, overseeing Senate activities, coordinating room bookings, and managing finances. 
        This division ensures the smooth functioning of all operational aspects and is also responsible for digital innovation. 
        By leading teams that develop custom solutions, it drives technological advancements tailored specifically to the needs of the SGA.
        </p>

        <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaOperations@northeastern.edu">sgaOperations@northeastern.edu</a></p>

        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Division Leadership</h3>
        <div className="flex justify-center">
          <div>
            <Pictures leader={pageData.leader} members={pageData.members}/>
          </div>
        </div>
      </div>

      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            <Committees committees={pageData.committees}/>
          </div>
        </div>        
      </div>
      <Footer />
    </>
  )
}

export default OperationalAffairs;