import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button.js';
import { RootState } from '../reduxStore/store.js';
import { logout } from '../reduxStore/slices/userSlice.js';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth?.token || null);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-[#1F1F1F] text-white z-20 relative shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img
            src='/src/assets/images/logo.svg'
            alt="Logo"
            className="h-8"
          />
        </div>

        {/* Navigation Section */}
        <nav className="space-x-6">
          {/* Show Login or Logout Button Based on Authentication */}
          {user === null ? (
            <Link to="/login">
              <Button className="bg-[#CCF575] text-black hover:bg-[#BCE064]">
                Login
              </Button>
            </Link>
          ) : (
            <Button
              className="bg-[#CCF575] text-black hover:bg-[#BCE064]"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
