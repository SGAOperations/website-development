import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';
import Boards from '../../components/Boards';

const ExBranchTemp = () => {
  {/* ABOUT */}  
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

  {/* LEADER */}  
  const leader = {
    name: 'Insert name',
    title: 'Insert title',
    image: ''
  }

  {/* MEMBERS */}  
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

  {/* COMMITTEES */}  
  const [committees, setCommittees] = useState([
    {
      title: 'Insert title', 
      description: 'Insert description',
      image: '',
      isEditing: false
    },
    {
      title: 'Insert title', 
      description: 'Insert description',
      image: '',
      isEditing: false
    }
  ]);

  const handleEditCommittee = (index) => {
    const updatedCommittees = [...committees];
    updatedCommittees[index].isEditing = true;
    setCommittees(updatedCommittees);
  }

  const handleSaveCommittee = (index) => {
    const updatedCommittees = [...committees];
    updatedCommittees[index].isEditing = false;
    setCommittees(updatedCommittees);
  }

  const handleCommitteeChange = (index, field, value) => {
    const updatedCommittees = [...committees];
    updatedCommittees[index][field] = value;
    setCommittees(updatedCommittees);
  }

  {/* BOARDS */}  
  const boards = [
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

  

  return (
    <>
      {/* HEADER */}
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Template</div>
      
      {/* ABOUT */}  
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

        {/* LEADER AND MEMBERS */}  
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaAcademicAffairs@northeastern.edu">sgaAcademicAffairs@northeastern.edu</a></p>
      <div>

      {/* COMMITTEES */}  
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            {committees.map((committee, index) => (
              <div key={index} className="mb-6">
                <div className="text-center">
                  {committee.isEditing ? (
                    <div>
                      <input 
                        type="text"
                        value={committee.title}
                        onChange={(e) => handleCommitteeChange(index, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
                      />
                      <textarea
                        value={committee.description}
                        onChange={(e) => handleCommitteeChange(index, 'description', e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg mb-2 text-black"
                        rows="4"
                      />
                      <button 
                        className="bg-sga-red text-white p-2 rounded-md" 
                        onClick={() => handleSaveCommittee(index)}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold">{committee.title}</h4>
                      <p>{committee.description}</p>
                      <button 
                        className="bg-sga-red text-white p-2 rounded-md mt-2"
                        onClick={() => handleEditCommittee(index)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
