import React from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';


const DiversityEquityInclusion = () => {
  const [leader, setLeader] = useState(null);
  const [members, setMembers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const divisionMapping = {
      "/diversity-equity-inclusion": "DIVERSITY_EQUITY_INCLUSION",
      "/senate": "SENATE",
      "/finance": "FINANCE",
    };

    const divisionName = divisionMapping[location.pathname];
    if (!divisionName) return;

    axios
      .get(`http://localhost:5001/users/division/${divisionName}`)
      .then((response) => {
        console.log("Fetched data:", response.data);
        if (Array.isArray(response.data)) {
          setLeader(response.data.find((user) => user.role === "leader"));
          setMembers(response.data.filter((user) => user.role !== "leader"));
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching executive board data:", error);
      });
  }, [location.pathname]);


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
        Diversity, Equity, and Inclusion
      </div>

      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">
          About the Division
        </h3>
        <p className="text-center text-black mx-30 mt-6 mb-2">
          The Diversity, Equity, and Inclusion Division drives change by
          actively addressing both internal and external DEI challenges. Through
          collaboration with a wide array of student organizations, cultural
          centers, and university leadership, DEI aims to foster an inclusive
          environment that empowers every voice. A single dedicated committee
          orchestrates these efforts, ensuring that the Division’s initiatives
          resonate across the campus community.
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
          href="mailto:sgaCampusAffairs@northeastern.edu"
        >
          sgaCampusAffairs@northeastern.edu
        </a>
      </p>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">
          Our Committees
        </h3>
        <div className="flex justify-center">
          <div>
            <Committes committes={committees} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DiversityEquityInclusion;