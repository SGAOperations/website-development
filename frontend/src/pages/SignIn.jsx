import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signed in with:', credentials);
    try {
      await login(credentials.username, credentials.password);
      navigate('/edit-mode');
      console.log('Signed in with:', credentials);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 bg-white p-8 shadow-lg rounded-lg m-20">
          <h3 className="text-5xl font-bold text-sga-red text-center mt-4 mb-4">Sign In</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg text-black mb-2" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-sga-red"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-lg text-black mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-sga-red"
                required
              />
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-sga-red text-white px-6 py-2 rounded-md hover:bg-sga-red-dark transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sga-red">Need an account? <a href="/sign-up" className="hover:underline">Sign Up</a></p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignIn;
