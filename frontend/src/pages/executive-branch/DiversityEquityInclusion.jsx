import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Cards from '../../components/Cards';
import { fetchData } from '../../services/userService';

const DiversityEquityInclusion = () => {
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
        const data = await fetchData('Diversity, Equity, and Inclusion');
        const sortedMembers = data.members.sort((a, b) => a.displayOrder - b.displayOrder);
        setPageData({ ...data, members: sortedMembers });
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
            <Pictures leader={pageData.leader} members={pageData.members}/>
          </div>
        </div>
      </div>

      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaCampusAffairs@northeastern.edu">sgaCampusAffairs@northeastern.edu</a></p>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            <Cards cards={pageData.committees}/>
          </div>
        </div>

        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Boards</h3>
        <div className="flex justify-center">
          <div>
            <Cards cards={pageData.boards}/>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}

export default DiversityEquityInclusion;