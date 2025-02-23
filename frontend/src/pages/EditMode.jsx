import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const EditMode = () => {
  const pageOptions = [
    'Academic Affairs',
    'Campus Affairs',
    'Diversity Equity',
    'Office Of The President',
    'Student Success'
  ];

  const [selectedPage, setSelectedPage] = useState(pageOptions[0]);
  const [pageData, setPageData] = useState({
    leader: { name: '', title: '', image: '' },
    members: [],
    committees: [],
    boards: []
  });

  const [isLeaderEditing, setIsLeaderEditing] = useState(false);
  const [leaderEditData, setLeaderEditData] = useState(pageData.leader);

  const [editingMemberIndex, setEditingMemberIndex] = useState(null);
  const [memberEditData, setMemberEditData] = useState(null);

  const [editingCommitteeIndex, setEditingCommitteeIndex] = useState(null);
  const [committeeEditData, setCommitteeEditData] = useState(null);

  const [editingBoardIndex, setEditingBoardIndex] = useState(null);
  const [boardEditData, setBoardEditData] = useState(null);

  // dummy data
  useEffect(() => {
    if (selectedPage === 'Academic Affairs') {
      setPageData({
        leader: {
          name: 'Devyani Anand',
          title: 'Vice President for Academic Affairs',
          image:
            'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/c78acba7-ca19-457c-8c4d-1df2451316cb/Devyani+Anand.jpg?format=2500w'
        },
        members: [
          {
            name: 'Quella Wang',
            title: 'Curriculum Committee Representative',
            image:
              'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/07681b43-eb1c-4245-be7f-2e5c9adcbbc0/Quella+Wang.jpeg?format=2500w'
          },
          {
            name: 'Ada Spiwak',
            title: 'Faculty Senate Representative',
            image:
              'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/7a50538e-5f0c-45c8-8769-3916e083bc19/Ada+Spiwek.jpg?format=2500w'
          },
          {
            name: 'Veer Dave',
            title: 'Assistant Vice President for Academic Affairs',
            image:
              'https://media.licdn.com/dms/image/v2/D4E03AQHFgwlJSfp-_Q/profile-displayphoto-shrink_200_200/0/1695110008299?e=2147483647&v=beta&t=aOSJSBzlSk55p57SPjIsdnLDp1bEi-tTgyx0zn0b11g'
          }
        ],
        committees: [
          {
            title: 'Academic Affairs Committee',
            description:
              'The academic affairs committee focuses on all projects within the division. Our goal is to collaborate with all colleges as well as other SGA committees to work on university wide initiatives.',
            image:
              'https://law.northeastern.edu/wp-content/uploads/2021/02/16x9-Students1.jpg'
          },
          {
            title: 'Sustainability Committee',
            description:
              'The Sustainability Committee works to create, support, and implement sustainable practices and initiatives on campus and in the global community.',
            image:
              'https://damore-mckim.northeastern.edu/wp-content/uploads/2021/04/Sustainability-1680x705-1-1680x705.jpg'
          }
        ],
        boards: []
      });
    } else {
      setPageData({
        leader: {
          name: 'Default Leader',
          title: `${selectedPage} Leader Title`,
          image: 'https://via.placeholder.com/150'
        },
        members: [
          {
            name: 'Default Member',
            title: 'Member Title',
            image: 'https://via.placeholder.com/150'
          }
        ],
        committees: [
          {
            title: 'Default Committee',
            description: `Committee description for ${selectedPage}`,
            image: 'https://via.placeholder.com/150'
          }
        ],
        boards: [
          {
            title: 'Default Board',
            description: `Board description for ${selectedPage}`,
            image: 'https://via.placeholder.com/150'
          }
        ]
      });
    }

    setIsLeaderEditing(false);
    setEditingMemberIndex(null);
    setEditingCommitteeIndex(null);
    setEditingBoardIndex(null);
    setLeaderEditData(pageData.leader);
    setMemberEditData(null);
    setCommitteeEditData(null);
    setBoardEditData(null);
  }, [selectedPage]);

  // leader handlers
  const handleLeaderEditOpen = () => {
    setIsLeaderEditing(true);
    setLeaderEditData(pageData.leader);
  };

  const handleLeaderSave = () => {
    setPageData({
      ...pageData,
      leader: leaderEditData
    });
    // axios.post('/api/updatePage', { page: selectedPage, leader: leaderEditData })
    //   .then(response => response.json())
    //   .catch(err => console.error(err));
    setIsLeaderEditing(false);
  };

  const handleLeaderDelete = () => {
    setPageData({
      ...pageData,
      leader: { name: '', title: '', image: '' }
    });
    setIsLeaderEditing(false);
  };

  // member handlers
  const handleMemberEditOpen = (index) => {
    setEditingMemberIndex(index);
    setMemberEditData(pageData.members[index]);
  };

  const handleMemberAdd = () => {
    setEditingMemberIndex(-1); // -1 indicates a new member
    setMemberEditData({ name: '', title: '', image: '' });
  };

  const handleMemberSave = () => {
    if (editingMemberIndex === -1) {
      setPageData({
        ...pageData,
        members: [...pageData.members, memberEditData]
      });
    } else {
      const updatedMembers = [...pageData.members];
      updatedMembers[editingMemberIndex] = memberEditData;
      setPageData({ ...pageData, members: updatedMembers });
    }
    setEditingMemberIndex(null);
    setMemberEditData(null);
  };

  const handleMemberDelete = () => {
    if (editingMemberIndex !== -1) {
      const updatedMembers = pageData.members.filter(
        (_, idx) => idx !== editingMemberIndex
      );
      setPageData({ ...pageData, members: updatedMembers });
    }
    setEditingMemberIndex(null);
    setMemberEditData(null);
  };

  // committee handlers
  const handleCommitteeEditOpen = (index) => {
    setEditingCommitteeIndex(index);
    setCommitteeEditData(pageData.committees[index]);
  };

  const handleCommitteeAdd = () => {
    setEditingCommitteeIndex(-1); // -1 indicates a new committee
    setCommitteeEditData({ title: '', description: '', image: '' });
  };

  const handleCommitteeSave = () => {
    if (editingCommitteeIndex === -1) {
      setPageData({
        ...pageData,
        committees: [...pageData.committees, committeeEditData]
      });
    } else {
      const updatedCommittees = [...pageData.committees];
      updatedCommittees[editingCommitteeIndex] = committeeEditData;
      setPageData({ ...pageData, committees: updatedCommittees });
    }
    setEditingCommitteeIndex(null);
    setCommitteeEditData(null);
  };

  const handleCommitteeDelete = () => {
    if (editingCommitteeIndex !== -1) {
      const updatedCommittees = pageData.committees.filter(
        (_, idx) => idx !== editingCommitteeIndex
      );
      setPageData({ ...pageData, committees: updatedCommittees });
    }
    setEditingCommitteeIndex(null);
    setCommitteeEditData(null);
  };

  // board handlers
  const handleBoardEditOpen = (index) => {
    setEditingBoardIndex(index);
    setBoardEditData(pageData.boards[index]);
  };

  const handleBoardAdd = () => {
    setEditingBoardIndex(-1);
    setBoardEditData({ title: '', description: '', image: '' });
  };

  const handleBoardSave = () => {
    if (editingBoardIndex === -1) {
      setPageData({
        ...pageData,
        boards: [...pageData.boards, boardEditData]
      });
    } else {
      const updatedBoards = [...pageData.boards];
      updatedBoards[editingBoardIndex] = boardEditData;
      setPageData({ ...pageData, boards: updatedBoards });
    }
    setEditingBoardIndex(null);
    setBoardEditData(null);
  };

  const handleBoardDelete = () => {
    if (editingBoardIndex !== -1) {
      const updatedBoards = pageData.boards.filter(
        (_, idx) => idx !== editingBoardIndex
      );
      setPageData({ ...pageData, boards: updatedBoards });
    }
    setEditingBoardIndex(null);
    setBoardEditData(null);
  };

  // page dropdown
  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 my-4 text-black bg-gray-50 rounded-lg min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8 text-sga-red">
          Edit Mode
        </h1>
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

        {/* leader section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Leader</h2>
          <div className="flex items-center gap-4">
            <img
              src={pageData.leader.image || 'https://via.placeholder.com/150'}
              alt={pageData.leader.name || 'Leader'}
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <p className="font-semibold">
                {pageData.leader.name || 'No Leader Added'}
              </p>
              <p>{pageData.leader.title || 'Leader Title'}</p>
            </div>
            <button
              onClick={handleLeaderEditOpen}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-all duration-200"
            >
              {pageData.leader.name ? 'Edit Leader' : 'Add Leader'}
            </button>
          </div>
        </div>

        {/* members section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Members</h2>
          {pageData.members.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-4 my-4 border-b pb-4"
            >
              <img
                src={member.image || 'https://via.placeholder.com/150'}
                alt={member.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p>{member.title}</p>
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

        {/* committees section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Committees</h2>
          {pageData.committees.map((committee, index) => (
            <div
              key={index}
              className="flex items-center gap-4 my-4 border-b pb-4"
            >
              <img
                src={committee.image || 'https://via.placeholder.com/150'}
                alt={committee.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{committee.title}</p>
                <p className="text-sm">{committee.description}</p>
              </div>
              <button
                onClick={() => handleCommitteeEditOpen(index)}
                className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-all duration-200"
              >
                Edit Committee
              </button>
            </div>
          ))}
          <button
            onClick={handleCommitteeAdd}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-all duration-200"
          >
            Add Committee
          </button>
        </div>

        {/* boards section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Boards</h2>
          {pageData.boards && pageData.boards.length > 0 ? (
            pageData.boards.map((board, index) => (
              <div
                key={index}
                className="flex items-center gap-4 my-4 border-b pb-4"
              >
                <img
                  src={board.image || 'https://via.placeholder.com/150'}
                  alt={board.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{board.title}</p>
                  <p className="text-sm">{board.description}</p>
                </div>
                <button
                  onClick={() => handleBoardEditOpen(index)}
                  className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-all duration-200"
                >
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

        {/* leader editing modal */}
        {isLeaderEditing && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Edit Leader Information</h3>
              <p className="mb-2 font-medium text-center">Live Preview:</p>
              <div className="bg-sga-red text-white p-4 rounded-xl shadow w-72 transition-all transform duration-300 relative mx-auto my-4">
                <img
                  src={leaderEditData.image || 'https://via.placeholder.com/150'}
                  alt={leaderEditData.name || 'Leader'}
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
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={leaderEditData.title}
                  onChange={(e) =>
                    setLeaderEditData({ ...leaderEditData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image URL:</label>
                <input
                  type="text"
                  value={leaderEditData.image}
                  onChange={(e) =>
                    setLeaderEditData({ ...leaderEditData, image: e.target.value })
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
                {leaderEditData.name && (
                  <button
                    onClick={handleLeaderDelete}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                  >
                    Delete Leader
                  </button>
                )}
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

        {/* member editing modal */}
        {editingMemberIndex !== null && memberEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingMemberIndex === -1 ? 'Add Member' : 'Edit Member Information'}
              </h3>
              <p className="mb-2 font-medium text-center">Live Preview:</p>
              <div className="flex flex-col items-center bg-white text-black p-4 rounded-xl shadow w-72 transition-all transform duration-400 relative mx-auto my-4">
                <img
                  src={memberEditData.image || 'https://via.placeholder.com/150'}
                  alt={memberEditData.name || 'Member'}
                  className="w-full h-64 object-cover rounded-lg shadow"
                />
                <h3 className="text-xl font-semibold mt-3">
                  {memberEditData.title || 'Title'}
                </h3>
                <p className="text-gray-700 mt-2">
                  {memberEditData.name || 'Name'}
                </p>
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
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={memberEditData.title}
                  onChange={(e) =>
                    setMemberEditData({ ...memberEditData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image URL:</label>
                <input
                  type="text"
                  value={memberEditData.image}
                  onChange={(e) =>
                    setMemberEditData({ ...memberEditData, image: e.target.value })
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

        {/* committee editing modal */}
        {editingCommitteeIndex !== null && committeeEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingCommitteeIndex === -1 ? 'Add Committee' : 'Edit Committee Information'}
              </h3>
              <p className="mb-2 font-medium text-center">Live Preview:</p>
              <div className="flex flex-row items-center bg-white text-black p-10 rounded-xl shadow-xl w-full transition-all transform hover:-translate-y-2 duration-400 relative mx-auto my-4">
                <img
                  src={committeeEditData.image || 'https://via.placeholder.com/150'}
                  alt={committeeEditData.title || 'Committee'}
                  className="max-w-[165px] h-[100px] object-cover rounded-lg shadow"
                />
                <div className="flex flex-col mx-5 items-center">
                  <h3 className="text-xl font-semibold mt-6">
                    {committeeEditData.title || 'Title'}
                  </h3>
                  <p className="text-gray-700 mt-4 mx-5">
                    {committeeEditData.description || 'Description'}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={committeeEditData.title}
                  onChange={(e) =>
                    setCommitteeEditData({ ...committeeEditData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea
                  value={committeeEditData.description}
                  onChange={(e) =>
                    setCommitteeEditData({ ...committeeEditData, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image URL:</label>
                <input
                  type="text"
                  value={committeeEditData.image}
                  onChange={(e) =>
                    setCommitteeEditData({ ...committeeEditData, image: e.target.value })
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
                {editingCommitteeIndex !== -1 && (
                  <button
                    onClick={handleCommitteeDelete}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all duration-200"
                  >
                    Delete Committee
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

        {/* board editing modal */}
        {editingBoardIndex !== null && boardEditData && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 shadow-xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">
                {editingBoardIndex === -1 ? 'Add Board' : 'Edit Board Information'}
              </h3>
              <p className="mb-2 font-medium text-center">Live Preview:</p>
              <div className="flex flex-row items-center bg-white text-black p-10 rounded-xl shadow-xl w-full transition-all transform hover:-translate-y-2 duration-400 relative mx-auto my-4">
                <img
                  src={boardEditData.image || 'https://via.placeholder.com/150'}
                  alt={boardEditData.title || 'Board'}
                  className="max-w-[165px] h-[100px] object-cover rounded-lg shadow"
                />
                <div className="flex flex-col mx-5 items-center">
                  <h3 className="text-xl font-semibold mt-6">
                    {boardEditData.title || 'Title'}
                  </h3>
                  <p className="text-gray-700 mt-4 mx-5">
                    {boardEditData.description || 'Description'}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={boardEditData.title}
                  onChange={(e) =>
                    setBoardEditData({ ...boardEditData, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea
                  value={boardEditData.description}
                  onChange={(e) =>
                    setBoardEditData({ ...boardEditData, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Image URL:</label>
                <input
                  type="text"
                  value={boardEditData.image}
                  onChange={(e) =>
                    setBoardEditData({ ...boardEditData, image: e.target.value })
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
      </div>
    </>
  );
};

export default EditMode;
