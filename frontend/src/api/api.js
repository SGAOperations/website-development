import axios from 'axios';

const BASE_URL = 'http://localhost:5000/users/';

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
