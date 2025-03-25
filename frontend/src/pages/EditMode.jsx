import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { createUser, updateUser, deleteUser, getUsers } from '../api/api';
import { useNavigate } from 'react-router-dom';

const pageOptions = [
  'Office of the President',
  'Academic Affairs',
  'Campus Affairs',
  'Diversity, Equity, and Inclusion',
  'External Affairs',
  'Student Involvement',
  'Student Success',
  'Operational Affairs'
];

const EditMode = () => {
  const [selectedPage, setSelectedPage] = useState(() => {
    // get the last selected tab from local storage or default to the first one
    return localStorage.getItem('selectedPage') || pageOptions[0];
  });
  const [pageData, setPageData] = useState({
    leader: { name: '', title: '', pictureUrl: '', _id: '' },
    members: [],
    committees: [],
    boards: [],
    workingGroups: []
  });

  const [isLeaderEditing, setIsLeaderEditing] = useState(false);
  const [leaderEditData, setLeaderEditData] = useState(pageData.leader);

  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [memberEditData, setMemberEditData] = useState(null);

  const [editingCommitteeIndex, setEditingCommitteeIndex] = useState(null);
  const [committeeEditData, setCommitteeEditData] = useState(null);

  const [editingBoardIndex, setEditingBoardIndex] = useState(null);
  const [boardEditData, setBoardEditData] = useState(null);

  const [editingWorkingGroupIndex, setEditingWorkingGroupIndex] = useState(null);
  const [workingGroupEditData, setWorkingGroupEditData] = useState(null);

  // fetch + group users based on the selected division
  useEffect(() => {
    // save selected tab to local storage whenever it changes
    localStorage.setItem('selectedPage', selectedPage);
    async function fetchUsers() {
      try {
        const allUsers = await getUsers();
        const divisionUsers = allUsers.filter(
          (user) => user.divisionName === selectedPage
        );
        const leader = divisionUsers.find((user) => user.role === 'leader') || { name: '', title: '', pictureUrl: '', _id: '' };
        const members = divisionUsers.filter((user) => user.role === 'member');
        const committees = divisionUsers.filter((user) => user.role === 'committee');
        const boards = divisionUsers.filter((user) => user.role === 'board');
        const workingGroups = divisionUsers.filter((user) => user.role === 'workingGroup');
        setPageData({ leader, members, committees, boards, workingGroups });
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();

    setIsLeaderEditing(false);
    setEditingMemberIndex(null);
    setEditingCommitteeIndex(null);
    setEditingBoardIndex(null);
    setEditingWorkingGroupIndex(null);
    setLeaderEditData(pageData.leader);
    setMemberEditData(null);
    setCommitteeEditData(null);
    setBoardEditData(null);
    setWorkingGroupEditData(null);
  }, [selectedPage]);

  // --- Leader Handlers ---
  const handleLeaderEditOpen = () => {
    setIsLeaderEditing(true);
    setLeaderEditData(pageData.leader);
  };

  const handleLeaderSave = async () => {
    try {
      const userData = {
        name: leaderEditData.name,
        pictureUrl: leaderEditData.pictureUrl || '',
        position: leaderEditData.title,
        divisionName: selectedPage,
        role: 'leader'
      };
      const res = await createUser(userData);
      setPageData((prev) => ({
        ...prev,
        leader: { 
          ...leaderEditData,
          pictureUrl: leaderEditData.pictureUrl || '',
          _id: res._id 
        }
      }));
    } catch (err) {
      console.error(err);
    }
    setIsLeaderEditing(false);
  };

  const handleLeaderDelete = async () => {
    if (pageData.leader._id) {
      try {
        await deleteUser(pageData.leader._id);
        setPageData((prev) => ({
          ...prev,
          leader: { name: '', title: '', pictureUrl: '', _id: '' }
        }));
      } catch (err) {
        console.error(err);
      }
    }
    setIsLeaderEditing(false);
  };

  // --- Member Handlers ---
  const handleMemberEditOpen = (index) => {
    setEditingMemberIndex(index);
    setMemberEditData(pageData.members[index]);
  };

  const handleMemberAdd = async () => {
    setMemberEditData({ name: '', title: '', image: '' });
    setEditingMemberIndex(-1);
  };

  const handleMemberSave = async () => {
    try {
      const userData = {
        name: memberEditData.name,
        pictureUrl: memberEditData.image || memberEditData.pictureUrl,
        position: memberEditData.title || memberEditData.position,
        divisionName: selectedPage,
        role: 'member'
      };
      let res;
      let updatedMembers = [...pageData.members];
      if (editingMemberIndex === -1) {
        res = await createUser(userData);
        updatedMembers.push({ ...memberEditData, _id: res._id });
      } else {
        res = await updateUser({ ...userData, _id: pageData.members[editingMemberIndex]._id });
        updatedMembers[editingMemberIndex] = { ...memberEditData, _id: res._id };
      }
      setPageData((prev) => ({ ...prev, members: updatedMembers }));
    } catch (err) {
      console.error(err);
    }
    setEditingMemberIndex(null);
    setMemberEditData(null);
  };

  const handleMemberDelete = async () => {
    if (pageData.members[editingMemberIndex]?._id) {
      try {
        await deleteUser(pageData.members[editingMemberIndex]._id);
        const updatedMembers = pageData.members.filter(
          (_, idx) => idx !== editingMemberIndex
        );
        setPageData((prev) => ({ ...prev, members: updatedMembers }));
      } catch (err) {
        console.error(err);
      }
    }
    setEditingMemberIndex(null);
    setMemberEditData(null);
  };

  // --- Committee Handlers ---
  const handleCommitteeEditOpen = (index) => {
    setEditingCommitteeIndex(index);
    setCommitteeEditData(pageData.committees[index]);
  };

  const handleCommitteeAdd = () => {
    setEditingCommitteeIndex(-1);
    setCommitteeEditData({ title: '', description: ''});
  };

  const handleCommitteeSave = async () => {
    try {
      const data = {
        name: committeeEditData.name || committeeEditData.title,
        blurb: committeeEditData.blurb || committeeEditData.description,
        divisionName: selectedPage,
        role: 'committee'
      };
      let res;
      let updatedCommittees = [...pageData.committees];
      if (editingCommitteeIndex === -1) {
        res = await createUser(data);
        updatedCommittees.push({ ...committeeEditData, _id: res._id });
      } else {
        res = await updateUser({ ...data, _id: pageData.committees[editingCommitteeIndex]._id });
        updatedCommittees[editingCommitteeIndex] = { ...committeeEditData, _id: res._id };
      }
      setPageData((prev) => ({ ...prev, committees: updatedCommittees }));
    } catch (err) {
      console.error(err);
    }
    setEditingCommitteeIndex(null);
    setCommitteeEditData(null);
  };

  const handleCommitteeDelete = async () => {
    if (pageData.committees[editingCommitteeIndex]?._id) {
      try {
        await deleteUser(pageData.committees[editingCommitteeIndex]._id);
        const updatedCommittees = pageData.committees.filter(
          (_, idx) => idx !== editingCommitteeIndex
        );
        setPageData((prev) => ({ ...prev, committees: updatedCommittees }));
      } catch (err) {
        console.error(err);
      }
    }
    setEditingCommitteeIndex(null);
    setCommitteeEditData(null);
  };

  // --- Board Handlers ---
  const handleBoardEditOpen = (index) => {
    setEditingBoardIndex(index);
    setBoardEditData(pageData.boards[index]);
  };

  const handleBoardAdd = () => {
    setEditingBoardIndex(-1);
    setBoardEditData({ name: '', blurb: '', pictureUrl: '' });
  };

  const handleBoardSave = async () => {
    try {
      const userData = {
        name: boardEditData.name || boardEditData.title,
        pictureUrl: boardEditData.pictureUrl || boardEditData.image,
        blurb: boardEditData.blurb,
        divisionName: selectedPage,
        role: 'board'
      };
      let res;
      let updatedBoards = [...pageData.boards];
      if (editingBoardIndex === -1) {
        res = await createUser(userData);
        updatedBoards.push({ 
          name: userData.name,
          pictureUrl: userData.pictureUrl,
          blurb: userData.blurb,
          _id: res._id 
        });
      } else {
        res = await updateUser({ ...userData, _id: pageData.boards[editingBoardIndex]._id });
        updatedBoards[editingBoardIndex] = { 
          name: userData.name,
          pictureUrl: userData.pictureUrl,
          blurb: userData.blurb,
          _id: res._id 
        };
      }
      setPageData((prev) => ({ ...prev, boards: updatedBoards }));
    } catch (err) {
      console.error(err);
    }
    setEditingBoardIndex(null);
    setBoardEditData(null);
  };

  const handleBoardDelete = async () => {
    if (pageData.boards[editingBoardIndex]?._id) {
      try {
        await deleteUser(pageData.boards[editingBoardIndex]._id);
        const updatedBoards = pageData.boards.filter(
          (_, idx) => idx !== editingBoardIndex
        );
        setPageData((prev) => ({ ...prev, boards: updatedBoards }));
      } catch (err) {
        console.error(err);
      }
    }
    setEditingBoardIndex(null);
    setBoardEditData(null);
  };

  // --- Working Group Handlers ---
  const handleWorkingGroupEditOpen = (index) => {
    setEditingWorkingGroupIndex(index);
    setWorkingGroupEditData(pageData.workingGroups[index]);
  };

  const handleWorkingGroupAdd = () => {
    setEditingWorkingGroupIndex(-1);
    setWorkingGroupEditData({ name: '', blurb: '', pictureUrl: '' });
  };

  const handleWorkingGroupSave = async () => {
    try {
      const userData = {
        name: workingGroupEditData.name || workingGroupEditData.title,
        pictureUrl: workingGroupEditData.pictureUrl || workingGroupEditData.image,
        blurb: workingGroupEditData.blurb,
        divisionName: selectedPage,
        role: 'workingGroup'
      };
      let res;
      let updatedWorkingGroups = [...pageData.workingGroups];
      if (editingWorkingGroupIndex === -1) {
        res = await createUser(userData);
        updatedWorkingGroups.push({ 
          name: userData.name,
          pictureUrl: userData.pictureUrl,
          blurb: userData.blurb,
          _id: res._id 
        });
      } else {
        res = await updateUser({ ...userData, _id: pageData.workingGroups[editingWorkingGroupIndex]._id });
        updatedWorkingGroups[editingWorkingGroupIndex] = { 
          name: userData.name,
          pictureUrl: userData.pictureUrl,
          blurb: userData.blurb,
          _id: res._id 
        };
      }
      setPageData((prev) => ({ ...prev, workingGroups: updatedWorkingGroups }));
    } catch (err) {
      console.error(err);
    }
    setEditingWorkingGroupIndex(null);
    setWorkingGroupEditData(null);
  };

  const handleWorkingGroupDelete = async () => {
    if (pageData.workingGroups[editingWorkingGroupIndex]?._id) {
      try {
        await deleteUser(pageData.workingGroups[editingWorkingGroupIndex]._id);
        const updatedWorkingGroups = pageData.workingGroups.filter(
          (_, idx) => idx !== editingWorkingGroupIndex
        );
        setPageData((prev) => ({ ...prev, workingGroups: updatedWorkingGroups }));
      } catch (err) {
        console.error(err);
      }
    }
    setEditingWorkingGroupIndex(null);
    setWorkingGroupEditData(null);
  };

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  const navigate = useNavigate(); 

  const exitEditMode = () => {
    navigate('/');
  };

  return (
    <>
      
      <Header />
      <div className="container mx-auto p-6 my-4 text-black bg-gray-50 rounded-lg min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-sga-red">Edit Mode</h1>
        <div className="mb-8 flex justify-center items-center">
          <label htmlFor="pageSelect" className="mr-4 font-medium">
            Select Page:
          </label>
          <select
            id="pageSelect"
            value={selectedPage}
            onChange={handlePageChange}
            className="border border-gray-300 rounded p-2"
          >
            {pageOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>


        {/* Leader Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Leader</h2>
          <div className="flex items-center gap-4">
            <img
              src={pageData.leader.pictureUrl || ''}
              alt={pageData.leader.name}
              className="w-32 h-32 object-cover rounded"
            />
            <div className="flex flex-col items-start">
              <p className="font-semibold">{pageData.leader.name}</p>
              <p>{pageData.leader.title}</p>
            </div>
            <button
              onClick={handleLeaderEditOpen}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-all duration-200"
            >
              Edit Leader
            </button>
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Members</h2>
          {pageData.members.map((member, index) => (
            <div key={index} className="flex items-center gap-4 my-4 border-b pb-4">
              <img
                src={member.pictureUrl || member.image}
                alt={member.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex flex-col items-start">
                <p className="font-semibold">{member.name}</p>
                <p>{member.position}</p>
              </div>
              <button
                onClick={() => handleMemberEditOpen(index)}
                className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-all duration-200"
              >
                Edit Member
              </button>
            </div>
          ))}
          <button
            onClick={handleMemberAdd}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
          >
            Add Member
          </button>
        </div>

        {/* Committees Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Committees</h2>
          {pageData.committees && pageData.committees.length > 0 ? (
            pageData.committees.map((committee, index) => (
              <div key={index} className="flex items-left gap-4 my-4 border-b pb-4">
                <div className="flex flex-col items-start">
                  <p className="font-semibold">{committee.name || committee.title}</p>
                  <p className="text-left text-sm">{committee.blurb || committee.description}</p>
                </div>
                <button
                  onClick={() => handleCommitteeEditOpen(index)}
                  className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-all duration-200">
                  Edit Committee
                </button>
              </div>
            ))
          ) : (
            <p>No committees available for this page.</p>
          )}
          <button
            onClick={handleCommitteeAdd}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
          >
            Add Committee
          </button>
        </div>


        {/* Boards Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Boards</h2>
          {pageData.boards && pageData.boards.length > 0 ? (
            pageData.boards.map((board, index) => (
              <div key={index} className="flex items-left gap-4 my-4 border-b pb-4">
                <div className="flex flex-col items-start">
                  <p className="font-semibold">{board.name}</p>
                  <p className="text-left text-sm">{board.blurb}</p>
                </div>
                <button
                  onClick={() => handleBoardEditOpen(index)}
                  className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-all duration-200">
                  Edit Board
                </button>
              </div>
            ))
          ) : (
            <p>No boards available for this page.</p>
          )}
          <button
            onClick={handleBoardAdd}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
          >
            Add Board
          </button>
        </div>

        {/* Working Groups Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Working Groups</h2>
          {pageData.workingGroups && pageData.workingGroups.length > 0 ? (
            pageData.workingGroups.map((workingGroup, index) => (
              <div key={index} className="flex items-left gap-4 my-4 border-b pb-4">
                <div className="flex flex-col items-start">
                  <p className="font-semibold">{workingGroup.name}</p>
                  <p className="text-left text-sm">{workingGroup.blurb}</p>
                </div>
                <button
                  onClick={() => handleWorkingGroupEditOpen(index)}
                  className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-all duration-200"
                >
                  Edit Working Group
                </button>
              </div>
            ))
          ) : (
            <p>No working groups available for this page.</p>
          )}
          <button
            onClick={handleWorkingGroupAdd}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
          >
            Add Working Group
          </button>
        </div>

        {/* Leader Editing Modal */}
        {isLeaderEditing && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Edit Leader Information</h3>
              <div className="bg-sga-red text-white p-4 rounded-xl shadow w-72 transition-all transform duration-300 relative mx-auto my-4">
                <img
                  src={leaderEditData.pictureUrl || ''}
                  alt={leaderEditData.name}
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
                <h2 className="text-xl font-bold mt-3">
                  {leaderEditData.title || 'Title'}
                </h2>
                <p className="text-gray-200 mt-2">
                  {leaderEditData.name || 'Name'}
                </p>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={leaderEditData.position}
                  onChange={(e) =>
                    setLeaderEditData({ ...leaderEditData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Name:</label>
                <input
                  type="text"
                  value={leaderEditData.name}
                  onChange={(e) =>
                    setLeaderEditData({ ...leaderEditData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image URL:</label>
                <input
                  type="text"
                  value={leaderEditData.pictureUrl}
                  onChange={(e) =>
                    setLeaderEditData({ ...leaderEditData, pictureUrl: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleLeaderSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Save
                </button>
                <button
                  onClick={handleLeaderDelete}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Delete Leader
                </button>
                <button
                  onClick={() => setIsLeaderEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member Editing Modal */}
        {editingMemberIndex !== null && memberEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingMemberIndex === -1 ? 'Add Member' : 'Edit Member Information'}
              </h3>
              <div className="flex flex-col items-center bg-white text-black p-4 rounded-xl shadow w-72 transition-all transform duration-400 relative mx-auto my-4">
                <img
                  src={memberEditData.pictureUrl}
                  alt={memberEditData.name}
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
                <h3 className="text-xl font-semibold mt-3">
                  {memberEditData.position || 'Title'}
                </h3>
                <p className="text-gray-700 mt-2">
                  {memberEditData.name || 'Name'}
                </p>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={memberEditData.position}
                  onChange={(e) =>
                    setMemberEditData({ ...memberEditData, position: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Name:</label>
                <input
                  type="text"
                  value={memberEditData.name}
                  onChange={(e) =>
                    setMemberEditData({ ...memberEditData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image URL:</label>
                <input
                  type="text"
                  value={memberEditData.pictureUrl}
                  onChange={(e) =>
                    setMemberEditData({ ...memberEditData, pictureUrl: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleMemberSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Save
                </button>
                {editingMemberIndex !== -1 && (
                  <button
                    onClick={handleMemberDelete}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                  >
                    Delete Member
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingMemberIndex(null);
                    setMemberEditData(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

         {/* Committee Editing Modal */}
         {editingCommitteeIndex !== null && committeeEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-lg max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingCommitteeIndex === -1 ? 'Add Board' : 'Edit Board Information'}
              </h3>
              <div className="flex flex-row items-center bg-white text-black p-10 rounded-xl shadow-lg w-full transition-all transform duration-400 relative mx-auto my-4">
                <div className="flex flex-col mx-5 items-center">
                  <h3 className="text-xl font-semibold mt-6">
                    {committeeEditData.name || committeeEditData.title || 'Title'}
                  </h3>
                  <p className="text-gray-700 mt-4 mx-5">
                    {committeeEditData.blurb || 'Description'}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={committeeEditData.name || committeeEditData.title || ''}
                  onChange={(e) =>
                    setCommitteeEditData({ ...committeeEditData, name: e.target.value, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea
                  value={committeeEditData.blurb}
                  onChange={(e) =>
                    setCommitteeEditData({ ...committeeEditData, blurb: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleCommitteeSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Save
                </button>
                {committeeEditData !== -1 && (
                  <button
                    onClick={handleCommitteeDelete}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                  >
                    Delete Board
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingCommitteeIndex(null);
                    setCommitteeEditData(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Board Editing Modal */}
        {editingBoardIndex !== null && boardEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-lg max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingBoardIndex === -1 ? 'Add Board' : 'Edit Board Information'}
              </h3>
              <div className="flex flex-row items-center bg-white text-black p-10 rounded-xl shadow-lg w-full transition-all transform duration-400 relative mx-auto my-4">
                <div className="flex flex-col mx-5 items-center">
                  <h3 className="text-xl font-semibold mt-6">
                    {boardEditData.name || boardEditData.title || 'Title'}
                  </h3>
                  <p className="text-gray-700 mt-4 mx-5">
                    {boardEditData.blurb || 'Description'}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={boardEditData.name || boardEditData.title || ''}
                  onChange={(e) =>
                    setBoardEditData({ ...boardEditData, name: e.target.value, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea
                  value={boardEditData.blurb}
                  onChange={(e) =>
                    setBoardEditData({ ...boardEditData, blurb: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleBoardSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Save
                </button>
                {editingBoardIndex !== -1 && (
                  <button
                    onClick={handleBoardDelete}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                  >
                    Delete Board
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingBoardIndex(null);
                    setBoardEditData(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Working Group Editing Modal */}
        {editingWorkingGroupIndex !== null && workingGroupEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-lg max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingWorkingGroupIndex === -1 ? 'Add Working Group' : 'Edit Working Group Information'}
              </h3>
              <div className="flex flex-row items-center bg-white text-black p-10 rounded-xl shadow-lg w-full transition-all transform duration-400 relative mx-auto my-4">
                <div className="flex flex-col mx-5 items-center">
                  <h3 className="text-xl font-semibold mt-6">
                    {workingGroupEditData.name || workingGroupEditData.title || 'Title'}
                  </h3>
                  <p className="text-gray-700 mt-4 mx-5">
                    {workingGroupEditData.blurb || 'Description'}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={workingGroupEditData.name || workingGroupEditData.title || ''}
                  onChange={(e) =>
                    setWorkingGroupEditData({ 
                      ...workingGroupEditData, 
                      name: e.target.value,
                      title: e.target.value 
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea
                  value={workingGroupEditData.blurb || ''}
                  onChange={(e) =>
                    setWorkingGroupEditData({ ...workingGroupEditData, blurb: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleWorkingGroupSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Save
                </button>
                {editingWorkingGroupIndex !== -1 && (
                  <button
                    onClick={handleWorkingGroupDelete}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                  >
                    Delete Working Group
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingWorkingGroupIndex(null);
                    setWorkingGroupEditData(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>)}
          {/* Exit Edit Mode Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={exitEditMode} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-all duration-200"
            >
            Exit Edit Mode
            </button>
          </div>
          
          
      </div>
    </>
  );
};

export default EditMode;