import React from "react";

function Unauth() {
  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex justify-center items-center overflow-y-hidden">
      <img src="/src/assets/unauth.png" width="600px" />
      <button
        onClick={handleClick}
        className="mt-40 bg-transparent absolute text-white -ml-5 text-xl"
      >
        Home
      </button>
    </div>
  ); 
}

export default Unauth;
