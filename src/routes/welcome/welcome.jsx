import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./welcome.css";

const Welcome = ({ data }) => {
  console.log(data);
  return (
    <div className="welcome_container">
      <h5>
        Welcome,
        <br /> {data.strFirstName}&nbsp;{data.strLastName}
      </h5>
      <br />
      <p>
        Thank you for participating in your recent photography day!
        <br />
        You are almost finished.
      </p>
      <br />
      <div className="complete_cont">
        <p className="complete">
          <img src="/tick.png" alt="image" />
          Complete and verify your personal information
        </p>
        <p className="complete">
          <img src="/tick.png" alt="image" />
          Finalize your pose selection
        </p>
      </div>
      <br />
      <Link to="/check-details">
        <button>
          Continue&nbsp;<i className="fas fa-chevron-right"></i>
          <i className="fas fa-chevron-right"></i>
        </button>
      </Link>
    </div>
  );
};

export default Welcome;
