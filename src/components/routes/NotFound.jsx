import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center pb-20 md:pb-0">
      <img src={logo} className="h-24" />
      <p className="text-2xl md:text-4xl text-center">
        Think you came to the wrong party!
      </p>
      <p
        className="underline text-xl md:text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        Go back Home?
      </p>
    </div>
  );
};

export default NotFound;
