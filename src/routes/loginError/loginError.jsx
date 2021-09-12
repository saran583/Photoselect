import React from "react";
import "./loginError.css";

const LoginError = (props) => {
  return (
    <div className="error_cont">
      <div className="head">
        <div></div>
        <h5>Oh, no!</h5>
        <div></div>
      </div>
      <div className="body">
        <p>Check back soon, your photos are not quite ready. Thanks!</p>
      </div>
    </div>
  );
};

export default LoginError;
