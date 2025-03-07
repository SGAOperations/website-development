import React, { useEffect, useState } from "react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';

// const OfficeOfThePresident = () => {
//   const leader = {
//     name: 'Matthew Coughlin',
//     title: 'Student Body President',
//     image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/8c13d768-d94f-4d05-b34b-aa38299b07c5/Matthew+Coughlin.jpeg?format=2500w'
//   }
//   const members = [
//     {
//       name: 'Cassidy Donoghue', 
//       title: 'Executive Vice President',
//       image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/d28f9a4e-2677-4f38-9282-bebce6beb36d/Cassidy+Donoghue.jpeg?format=2500w' 
//     },
//     {
//       name: 'Aashvi Govind',
//       title: 'Assistant to the Executive Vice President',
//       image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/2abe54fb-5d4d-4a98-82b2-3d0be1b38091/Aashvi+Govind.jpeg?format=2500w'
//     },
//     {
//       name: 'Isabella Quintero-Socorro',
//       title: 'Assistant to the Executive Vice President',
//       image: ''
//     },
//     // TODO: replace website image urls with downloaded image urls
//   ]

const OfficeOfThePresident = () => {
  const [leader, setLeader] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/division/Office of the President"
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        if (data.length > 0) {
          setLeader(data[0]); // Assuming the first user is the leader
          setMembers(data.slice(1)); // The rest are members
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center text-black">Loading...</p>;
  }

  return (
    <>
      {/* uncomment when bg image is implemented */}
      {/* <div className="absolute top-0 left-0 w-full z-20"> */}
      <Header />
      {/* </div> */}

      {/* <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[75%] overflow-hidden">
          <img 
            className="w-full h-full scale-200 transform origin-center"
            src="" />
        </div>
      </div> */}
      {/* bg image goes ^^^ */}

      <div className="text-7xl mb-4 font-bold text-black text-center my-8">
        Office of the President
      </div>

      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">
          About the Division
        </h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
          The Office of the President consists of the Student Body President and
          the Executive Vice President, both of which are elected by the
          undergraduate student body. The Office of the President is responsible
          for organizing the entire Student Government Association. This
          includes executing all policies and objectives of the Association and
          overseeing external communications with the community bodies and
          Boston-area student governance bodies. Additionally, the EVP serves to
          assist the President in long-term planning, special projects, and
          initiatives and oversees the Association’s internal communications,
          all Senate communications, events, archives, fundraising, and alumni
          connections.
        </p>
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members} />
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">
        ✉️:{" "}
        <a
          className="text-center text-sga-red hover:underline transition-all duration-300"
          href="mailto:sgaPresident@northeastern.edu"
        >
          sgaPresident@northeastern.edu{" "}
        </a>
      </p>
      <p className="text-center text-sga-red">
        ✉️:{" "}
        <a
          className="text-center text-sga-red hover:underline transition-all duration-300"
          href="mailto:sgaEVP@northeastern.edu "
        >
          sgaEVP@northeastern.edu
        </a>
      </p>

      <Footer />
    </>
  );
};

export default OfficeOfThePresident;