import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar flex justify-start items-center">
      <Link to="/" className="mx-4">
        Create
      </Link>
      <Link to="/list" className="mx-4">
        List
      </Link>
    </nav>
  );
};

export default Navbar;
