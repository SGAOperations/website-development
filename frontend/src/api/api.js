import axios from 'axios';

const BASE_URL = 'http://localhost:5000/users/';

export const getUsers = async () => {
  return axios.get(BASE_URL)
  .then(res =>  res.data)
  .catch(err => {
    console.error('Error fetching users:', err)
    throw err;
  })
};

export const createUser = async (userData) => {
  console.log(userData)
  return axios.post(BASE_URL, userData)
  .then(res => res.data)
  .catch(err => {
    console.log("Error creating user: ", err)
    throw err;
  });
};

export const updateUser = async (userData) => {
  return axios.put(`${BASE_URL}${userData._id}`)
  .then(res => res.data)
  .catch(err => {
    console.log("Error updating user: ", err)
    throw err;
  });
}

export const deleteUser = async (userId) => {
  return axios.delete(`${BASE_URL}${userId}`)
  .then(res => res.data)
  .catch(err => {
    console.error('Error deleting user:', err)
    throw err;
  })
};
