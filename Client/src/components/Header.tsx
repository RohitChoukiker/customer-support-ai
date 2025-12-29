import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Spur logo"
              className="h-9 w-9"
            />
            <span className="text-xl font-semibold text-blue-600">
              Spur
            </span>
          </a>

        
<span className="text-sm mt-7 text-gray-500 ml-[-12px]">
  Customer Support Assistant
</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
