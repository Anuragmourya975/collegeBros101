import React from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import Unauth from "./Unauth";
import Navbar from "../components/Navbar";
function Dashboard() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const isLogIn = localStorage.getItem("isLoggedIn");
  if (!token) {
    navigate("/");
  }
  return (
    <div>
      {isLogIn ? (
        <div>
          <Navbar />
        </div>
      ) : (
        <div>
          <Unauth />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
