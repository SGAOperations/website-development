import axios from 'axios';

const BASE_URL = 'http://localhost:5000/users/';

export const getDivisions = async () => {
  return axios.get('http://localhost:5000/divisions')
  .then(res =>  res.data)
  .catch(err => {
    console.error('Error fetching divisions:', err)
    throw err;
  })
}

// Get all users
export const getUsers = async () => {
  return axios.get(BASE_URL)
  .then(res =>  res.data)
  .catch(err => {
    console.error('Error fetching users:', err)
    throw err;
  })
};

// Create a new user
export const createUser = async (userData) => {
  return axios.post(BASE_URL, userData)
  .then(res => {
    console.log("User created: ", res.data)
    return res.data
  })
  .catch(err => {
    console.log("Error creating user: ", err)
    throw err;
  });
};

// Update an existing user
export const updateUser = async (userData) => {
  return axios.put(`${BASE_URL}${userData._id}`, userData)
  .then(res => {
    console.log("User updated: ", res.data)
    return res.data
  })
  .catch(err => {
    console.log("Error updating user: ", err)
    throw err;
  });
}

// Delete an existing user
export const deleteUser = async (userId) => {
  return axios.delete(`${BASE_URL}${userId}`)
  .then(res => {
    console.log("User deleted: ", res.data)
    return res.data
  })
  .catch(err => {
    console.error('Error deleting user:', err)
    throw err;
  })
};

export const fetchData = async (division) => {
  try {
    const allUsers = await getUsers();
    const divisionUsers = allUsers.filter((user) => user.divisionName === division);
    
    const leader = divisionUsers.find((user) => user.role === 'leader') || {};
    const leaderData = { 
      name: leader.name || '', 
      title: leader.positions.role || '', 
      image: leader.pictureUrl || ''
    };

    const members = divisionUsers.filter((user) => user.role === 'member')
      .map(member => ({ 
        name: member.name, 
        title: member.positions.role, 
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

    return { leader: leaderData, members, committees, boards, workingGroups };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
