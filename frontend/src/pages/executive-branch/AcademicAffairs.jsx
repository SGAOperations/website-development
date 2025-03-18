import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';
import Boards from '../../components/Boards';
import { getUsers } from '../../api/api';

const AcademicAffairs = () => {
  const [pageData, setPageData] = useState({
    leader: { name: '', title: '', pictureUrl: '' },
    members: [],
    committees: [],
    boards: [],
    workingGroups: []
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const allUsers = await getUsers();
        const divisionUsers = allUsers.filter(
          (user) => user.divisionName === 'Academic Affairs'
        );
        
        // sort users by role
        const leader = divisionUsers.find((user) => user.role === 'leader') || { 
          name: '', 
          title: '', 
          pictureUrl: '' 
        };
        const members = divisionUsers.filter((user) => user.role === 'member')
          .map(member => ({
            name: member.name,
            title: member.position,
            image: member.pictureUrl
          }));
        const committees = divisionUsers.filter((user) => user.role === 'committee')
          .map(committee => ({
            title: committee.name,
            description: committee.blurb,
            image: committee.pictureUrl
          }));
        const boards = divisionUsers.filter((user) => user.role === 'board')
          .map(board => ({
            title: board.name,
            description: board.blurb,
            image: board.pictureUrl
          }));
        const workingGroups = divisionUsers.filter((user) => user.role === 'workingGroup')
          .map(group => ({
            title: group.name,
            description: group.blurb,
            image: group.pictureUrl
          }));

        const transformedLeader = {
          name: leader.name,
          title: leader.position,
          image: leader.pictureUrl
        };

        setPageData({ 
          leader: transformedLeader, 
          members, 
          committees, 
          boards,
          workingGroups 
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Academic Affairs</div>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">About the Division</h3>
        <div className="flex justify-center">
          <div>
            <Pictures leader={pageData.leader} members={pageData.members}/>
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaAcademicAffairs@northeastern.edu">sgaAcademicAffairs@northeastern.edu</a></p>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            <Committes committes={pageData.committees}/>
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
      {pageData.workingGroups.length > 0 && (
        <div>
          <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Working Groups</h3>
          <div className="flex justify-center">
            <div>
              <Boards boards={pageData.workingGroups}/>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AcademicAffairs;
