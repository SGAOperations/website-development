import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Pictures from '../../components/Pictures';
import Committes from '../../components/Committees';
import Boards from '../../components/Boards';

const AcademicAffairs = () => {
  const leader = {
    name: 'Devyani Anand',
    title: 'Vice President for Academic Affairs',
    image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/c78acba7-ca19-457c-8c4d-1df2451316cb/Devyani+Anand.jpg?format=2500w'
  }
  const members = [
    {
      name: 'Quella Wang', 
      title: 'Curriculum Committee Representative',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/07681b43-eb1c-4245-be7f-2e5c9adcbbc0/Quella+Wang.jpeg?format=2500w' 
    },
    {
      name: 'Ada Spiwak',
      title: 'Faculty Senate Representative',
      image: 'https://images.squarespace-cdn.com/content/v1/5939fcd1db29d6ec60929205/7a50538e-5f0c-45c8-8769-3916e083bc19/Ada+Spiwek.jpg?format=2500w'
    },
    {
      name: 'Veer Dave',
      title: 'Assistant Vice President for Academic Affairs',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQHFgwlJSfp-_Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1695110008299?e=2147483647&v=beta&t=aOSJSBzlSk55p57SPjIsdnLDp1bEi-tTgyx0zn0b11g'
    },
  ]

  const committees = [
    {
      title: 'Academic Affairs Committee', 
      description: 'The academic affairs committee focuses on all projects within the division. Our goal is to collaborate with all colleges as well as other SGA committees to work on university wide initiatives.',
      image: 'https://law.northeastern.edu/wp-content/uploads/2021/02/16x9-Students1.jpg'
    },
    {
      title: 'Sustainability Committee',
      description: 'The Sustainability Committee works to create, support, and implement sustainable practices and initiatives on campus and in the global Northeastern community. Taking an interdisciplinary approach, members work with other SGA divisions, student organizations, and administrative departments to best address the needs of students and to create a more sustainable campus. The Sustainability Committee is open to all undergraduate students with no prior experience and no commitment necessary. If you are interested, just show up!',
      image: 'https://damore-mckim.northeastern.edu/wp-content/uploads/2021/04/Sustainability-1680x705-1-1680x705.jpg'
    }
  ];

  const boards = [];

  // Editable content state
  const [aboutText, setAboutText] = useState(
    'The Academic Affairs division advocates for student needs related to academic services and practices. ' + 
    'It connects students, faculty, and administration on all academic matters, including close collaboration with the faculty senate and the provost\'s office. ' +
    'Our goal is to continually enhance the academic experience at Northeastern by evolving and adapting to new ideas and changes.'
  );
  
  const [isEditing, setIsEditing] = useState(false); // To track if the content is in edit mode

  const handleEditToggle = () => {
    setIsEditing(true); // Enable editing when clicked
  }

  const handleSave = () => {
    setIsEditing(false); // Save and exit edit mode
    // Optionally, you can handle saving this data to a backend or local storage.
  }

  return (
    <>
      <Header />
      <div className="text-7xl mb-4 font-bold text-black text-center my-8">Academic Affairs</div>
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
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
        </div>
        <div className="flex justify-center">
          <div>
            <Pictures leader={leader} members={members}/>
          </div>
        </div>
      </div>
      <p className="text-center text-sga-red">✉️: <a className="text-center text-sga-red hover:underline transition-all duration-300" href="mailto:sgaAcademicAffairs@northeastern.edu">sgaAcademicAffairs@northeastern.edu</a></p>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Committees</h3>
        <div className="flex justify-center">
          <div>
            <Committes committes={committees}/>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-5xl font-bold text-sga-red text-center mt-16 mb-4">Our Boards</h3>
        <div className="flex justify-center">
          <div>
            <Boards boards={boards}/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AcademicAffairs;
