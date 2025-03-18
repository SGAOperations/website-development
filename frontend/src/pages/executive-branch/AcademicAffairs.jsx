import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committees from '../../components/Committees';
import Boards from '../../components/Boards';
import { fetchData } from '../../api/api';

const AcademicAffairs = () => {
  const [pageData, setPageData] = useState({
    leader: { name: '', title: '', image: '' },
    members: [],
    committees: [],
    boards: [],
    workingGroups: []
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData('Academic Affairs');
        setPageData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } 
    };

    getData();
  }, []);

  return (
    <>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Academic Affairs</div>
      
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
      <p className="text-center text-black mx-30 mt-6 mb-2">
      The Academic Affairs division advocates for student needs related to academic services and practices. 
      It connects students, faculty, and administration on all academic matters, including close collaboration with the faculty senate and the provost's office. 
      Our goal is to continually enhance the academic experience at Northeastern by evolving and adapting to new ideas and changes.
      </p>

      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaAcademicAffairs@northeastern.edu">sgaAcademicAffairs@northeastern.edu</a></p>
      <div>
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

      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Boards</h3>
        <div className="flex justify-center">
          <div>
            <Boards boards={pageData.boards}/>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Working Groups</h3>
        <div className="flex justify-center">
          <div>
            <Boards boards={pageData.workingGroups}/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AcademicAffairs;
