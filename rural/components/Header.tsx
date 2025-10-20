import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { JobContext } from '../contexts/JobContext';
import { BellIcon } from './IconComponents';

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const jobContext = useContext(JobContext);

  const activeLinkStyle = {
    color: '#F3EAD3', // brand-cream
    textDecoration: 'underline',
  };

  const notificationCount = jobContext?.notifications.length || 0;

  return (
    <header className="bg-brand-green shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold text-white">
              Rural Roots Jobs
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className="text-brand-brown hover:text-brand-cream px-3 py-2 rounded-md text-lg font-medium transition-colors"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Home
              </NavLink>
              <NavLink
                to="/full-time"
                className="text-brand-brown hover:text-brand-cream px-3 py-2 rounded-md text-lg font-medium transition-colors"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Full-Time
              </NavLink>
              <NavLink
                to="/part-time"
                className="text-brand-brown hover:text-brand-cream px-3 py-2 rounded-md text-lg font-medium transition-colors"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              >
                Part-Time
              </NavLink>
              {auth?.userType === 'provider' && (
                 <NavLink
                    to="/add-job"
                    className="text-brand-brown hover:text-brand-cream px-3 py-2 rounded-md text-lg font-medium transition-colors"
                    style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                >
                    Post a Job
                </NavLink>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            {auth?.isLoading ? (
              <div className="text-brand-cream">Loading...</div>
            ) : auth?.currentUser ? (
              <div className="flex items-center space-x-4">
                {auth.userType === 'provider' && (
                  <Link to="/profile" className="relative text-brand-brown hover:text-brand-cream">
                    <BellIcon className="h-6 w-6" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                )}
                <NavLink to="/profile" className="text-brand-brown hover:text-brand-cream font-medium">
                  Hi, {auth.currentUser.username}
                </NavLink>
                <button
                  onClick={auth.logout}
                  className="bg-brand-light-green text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-brand-brown hover:text-brand-cream px-3 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-light-green text-white px-4 py-2 rounded-full text-lg font-semibold hover:bg-opacity-90 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
