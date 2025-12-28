import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Spur Logo"
          className="h-9 w-9 mr-2"
        />

        {/* Brand name */}
        <span className="text-xl font-semibold text-blue-600">
          Spur
        </span>
      </div>
    </header>
  );
};

export default Header;
