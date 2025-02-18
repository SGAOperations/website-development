import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';
import Boards from '../../components/Boards';

const ExBranchTemp = () => {
  const leader = {
    name: 'Insert name',
    title: 'Insert title',
    image: ''
  }
  const members = [
    {
      name: 'Insert name', 
      title: 'Insert title',
      image: '' 
    },
    {
      name: 'Insert name', 
      title: 'Insert title',
      image: ''
    },
  ]

  const committees = [
    {
      title: 'Insert title', 
      description: 'Insert description',
      image: '' 
    },
    {
      title: 'Insert title', 
      description: 'Insert description',
      image: ''
    }
  ];

  const boards = [];

  const [aboutText, setAboutText] = useState(
    'Insert about section'
  );
  
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(true); 
  }

  const handleSave = () => {
    setIsEditing(false);
  }

  return (
    <>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Template</div>

      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>

        <div className="text-center text-black mx-30 mt-6 mb-2">
          {isEditing ? (
            <div>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg"
                rows="6"
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)} 
              />
              <div className="flex justify-center mt-4">
                <button 
                  className="bg-sga-red text-white p-2 rounded-md" 
                  onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <p>{aboutText}</p>
          )}
        </div>
        
        <div className="flex justify-center mt-4">
          {!isEditing && (
            <button
              className="bg-sga-red text-white p-2 rounded-md"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
        </div>
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaAcademicAffairs@northeastern.edu">sgaAcademicAffairs@northeastern.edu</a></p>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            <Committes committes={committees}/>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Boards</h3>
        <div className="flex justify-center">
          <div>
            <Boards boards={boards}/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExBranchTemp;
