import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-3 px-4">
        {/* App Name */}
        <h1 className="text-white text-2xl font-bold tracking-wide">
          SocialLens
        </h1>
        {/* Tabs */}
        <div className="space-x-6">
          <Link to="https://github.com/toshit-dh/social-lens" className="text-white hover:text-indigo-200">
            Github
          </Link>
        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
