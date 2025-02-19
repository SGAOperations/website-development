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
  const [leader, setLeader] = useState({
    name: 'Insert name',
    title: 'Insert title',
    image: ''
  });

  const handleEditLeader = () => {
    setLeader((prevLeader) => ({
      ...prevLeader,
      isEditing: !prevLeader.isEditing
    }));
  }

  const handleLeaderChange = (field, value) => {
    setLeader((prevLeader) => ({
      ...prevLeader,
      [field]: value
    }));
  }

  {/* MEMBERS */}  
  const [members, setMembers] = useState([
    {
      name: 'Insert name', 
      title: 'Insert title',
      image: '', 
      isEditing: false
    },
    {
      name: 'Insert name', 
      title: 'Insert title',
      image: '',
      isEditing: false
    },
  ]);

  const handleEditMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers[index].isEditing = !updatedMembers[index].isEditing;
    setMembers(updatedMembers);
  }

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  }

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
  const [boards, setBoards] = useState([
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

  const handleEditBoard = (index) => {
    const updatedBoards = [...boards];
    updatedBoards[index].isEditing = true;
    setBoards(updatedBoards);  {/* FIXED HERE */}
  }

  const handleSaveBoard = (index) => {
    const updatedBoards = [...boards];
    updatedBoards[index].isEditing = false;
    setBoards(updatedBoards);  {/* FIXED HERE */}
  }

  const handleBoardChange = (index, field, value) => {
    const updatedBoards = [...boards];
    updatedBoards[index][field] = value;
    setBoards(updatedBoards);  {/* FIXED HERE */}
  }

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
              Edit About Section
            </button>
          )}
        </div>
      </div>

      {/* LEADER AND MEMBERS */}  
      <div className="flex justify-center space-x-8 mt-16">
        <div>
          <h3 className="text-3xl font-bold text-sga-red text-center">Leader</h3>
          <div className="mb-6">
            <input
              type="text"
              value={leader.name}
              onChange={(e) => handleLeaderChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
              readOnly={!leader.isEditing}
            />
            <input
              type="text"
              value={leader.title}
              onChange={(e) => handleLeaderChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
              readOnly={!leader.isEditing}
            />
            <div>
              {leader.isEditing ? (
                <button
                  className="bg-sga-red text-white p-2 rounded-md mt-2"
                  onClick={handleEditLeader}
                >
                  Save Leader
                </button>
              ) : (
                <button
                  className="bg-sga-red text-white p-2 rounded-md mt-2"
                  onClick={handleEditLeader}
                >
                  Edit Leader
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-sga-red text-center">Members</h3>
          <div className="flex justify-center space-x-8 mt-4">
            {members.map((member, index) => (
              <div key={index} className="mb-6">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
                  readOnly={!member.isEditing}
                />
                <input
                  type="text"
                  value={member.title}
                  onChange={(e) => handleMemberChange(index, 'title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
                  readOnly={!member.isEditing}
                />
                <div>
                  {member.isEditing ? (
                    <button
                      className="bg-sga-red text-white p-2 rounded-md mt-2"
                      onClick={() => handleEditMember(index)}
                    >
                      Save Member
                    </button>
                  ) : (
                    <button
                      className="bg-sga-red text-white p-2 rounded-md mt-2"
                      onClick={() => handleEditMember(index)}
                    >
                      Edit Member
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaAcademicAffairs@northeastern.edu">sgaAcademicAffairs@northeastern.edu</a></p>

      {/* COMMITTEES */}  
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
      <div className="flex justify-center">
        <div>
          {committees.map((committee, index) => (
            <div key={index} className="mb-6">
              <div className="text-center">
                <div>
                  <input
                    type="text"
                    value={committee.title}
                    onChange={(e) => handleCommitteeChange(index, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
                    readOnly={!committee.isEditing} 
                  />
                  <textarea
                    value={committee.description}
                    onChange={(e) => handleCommitteeChange(index, 'description', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg mb-2 text-black"
                    rows="4"
                    readOnly={!committee.isEditing} 
                  />
                  {!committee.isEditing && (
                    <button 
                      className="bg-sga-red text-white p-2 rounded-md"
                      onClick={() => handleEditCommittee(index)}
                    >
                      Edit
                    </button>
                  )}
                  {committee.isEditing && (
                    <button 
                      className="bg-sga-red text-white p-2 rounded-md"
                      onClick={() => handleSaveCommittee(index)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOARDS */}  
      <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Boards</h3>
      <div className="flex justify-center">
        <div>
          {boards.map((board, index) => (
            <div key={index} className="mb-6">
              <div className="text-center">
                <div>
                  <input
                    type="text"
                    value={board.title}
                    onChange={(e) => handleBoardChange(index, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
                    readOnly={!board.isEditing} 
                  />
                  <textarea
                    value={board.description}
                    onChange={(e) => handleBoardChange(index, 'description', e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg mb-2 text-black"
                    rows="4"
                    readOnly={!board.isEditing} 
                  />
                  {!board.isEditing && (
                    <button 
                      className="bg-sga-red text-white p-2 rounded-md"
                      onClick={() => handleEditBoard(index)}
                    >
                      Edit
                    </button>
                  )}
                  {board.isEditing && (
                    <button 
                      className="bg-sga-red text-white p-2 rounded-md"
                      onClick={() => handleSaveBoard(index)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default ExBranchTemp;
