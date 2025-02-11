import React, { useState } from "react";

const Pictures = ({ leader, members = [] }) => {
  const [hoverStyle, setHoverStyle] = useState({});

  const handleMouseMove = (e, index, isLeader) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const gradient = isLeader
      ? `radial-gradient(circle at ${x}% ${y}%, rgba(234, 234, 234, 0.28), transparent 70%)`
      : `radial-gradient(circle at ${x}% ${y}%, rgba(205, 11, 11, 0.14), transparent 55%)`;
    setHoverStyle((prev) => ({ ...prev, [index]: { background: gradient } }));
  };

  const handleMouseLeave = (index) => {
    setHoverStyle((prev) => ({ ...prev, [index]: {} }));
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
      <div
        className="md:items-start bg-sga-red text-white p-4 rounded-xl shadow-black/20 shadow-xl w-72 transition-all transform hover:-translate-y-2 hover:shadow-black/50 duration-300 hover:shadow-2xl relative"
        style={hoverStyle.leader}
        onMouseMove={(e) => handleMouseMove(e, "leader", true)}
        onMouseLeave={() => handleMouseLeave("leader")}
      >
        <img
          src={leader.image}
          alt={leader.name}
          className="w-full h-63 object-cover rounded-lg shadow"
        />
        <h2 className="text-xl font-bold mt-3">{leader.title}</h2>
        <p className="text-gray-200 mt-2">{leader.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white text-black p-4 rounded-xl shadow-xl w-72 transition-all transform hover:-translate-y-2 hover:shadow-2xl transition duration-400 relative"
            style={hoverStyle[index]}
            onMouseMove={(e) => handleMouseMove(e, index, false)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-63 object-cover rounded-lg shadow"
            />
            <h3 className="text-xl font-semibold mt-3">{member.title}</h3>
            <p className="text-gray-700 mt-2">{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pictures;
