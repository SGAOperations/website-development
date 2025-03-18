import React, { useState } from "react";

const Committees = ({ committees = [] }) => {
  const [hoverStyle, setHoverStyle] = useState({});

  const handleMouseMove = (e, index) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setHoverStyle((prev) => ({ ...prev, [index]: { background: `radial-gradient(circle at ${x}% ${y}%, rgba(205, 11, 11, 0.14), transparent 40%)`} }));
  };

  const handleMouseLeave = (index) => {
    setHoverStyle((prev) => ({ ...prev, [index]: {} }));
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 h-auto">

      <div className="grid grid-flow-row gap-8">
        {committees.map((committee, index) => (
          <div
            key={index}
            className="flex flex-row items-center bg-white text-black p-10 rounded-xl shadow-xl w-full transition-all transform hover:-translate-y-2 hover:shadow-2xl transition duration-400 relative"
            style={hoverStyle[index]}
            onMouseMove={(e) => handleMouseMove(e, index, false)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <img
              src={committee.image}
              alt={committee.title}
              className="max-w-165 h-100 object-cover rounded-lg shadow"
            />
            <div className="flex flex-col mx-5 items-center">
              <h3 className="text-xl font-semibold mt-6">{committee.title}</h3>
              <p className="text-gray-700 mt-4 mx-5">{committee.description}</p>
              <button className="w-50 bg-sga-red text-white m-4 transition-all transform hover:-translate-y-1 hover:shadow-md transition duration-400" onClick={() => {}} type="button">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Committees;
