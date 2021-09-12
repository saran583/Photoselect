import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./header.css";

const Header = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [className, setClassName] = useState("side_menu out");
  const openMenu = () => {
    setClassName("side_menu in");
    setShowMenu(true);
  };
  const closeMenu = () => {
    setClassName("side_menu out");
    setTimeout(() => {
      setShowMenu(false);
    }, 500);
  };
  return (
    <div className="header_container">
      <Link to="/">
        <img src="/logo.png" alt="logo" />
      </Link>
      <img
        src="/threelines.png"
        className="menu"
        width="35"
        height="30"
        alt="menu"
        onClick={openMenu}
      />
      {showMenu && (
        <div className={className}>
          <span onClick={closeMenu}>
            <i className="fas fa-times"></i>
          </span>
          <h5>Sharing</h5>
          <span className="share">
            <i className="fas fa-share-alt"></i>
          </span>
          <p>Share your portraits</p>
        </div>
      )}
      {/* header working! */}
    </div>
  );
};

export default Header;