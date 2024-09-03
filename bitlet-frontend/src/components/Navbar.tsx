import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "start",
        justifyItems: "center",
      }}
    >
      <Link to="/">Create</Link>
      <Link to="/list">List</Link>
    </nav>
  );
};

export default Navbar;
