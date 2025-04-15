import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import { fetchData } from '../../services/userService';

const ExternalAffairs = () => {
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
        const data = await fetchData('External Affairs');
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

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">External Affairs</div>
      
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
        The External Affairs division serves as the vibrant bridge between our Association and the broader Northeastern University undergraduate population. 
        Through our Communications and Events Committee, we aim to engage and unify the student body by harnessing the power of social media and organizing meaningful and educational events that resonate with our students. 
        Additionally, our dedicated Boston Intercollegiate Government (BIG) representatives advocate for SGA within the larger tapestry of the Boston Intercollegiate Government, ensuring Northeastern’s voice is heard and our presence felt on a wider stage.
        </p>

        <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaExternalAffairs@northeastern.edu">sgaExternalAffairs@northeastern.edu</a></p>

        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Division Leadership</h3>
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

export default ExternalAffairs;