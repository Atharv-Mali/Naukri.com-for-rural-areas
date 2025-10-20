import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserType } from '../types';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (type: UserType) => {
    // This is a mock login, we are just checking if username exists
    // In a real app, you would verify credentials against a backend
     if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
    
    setIsLoggingIn(true);
    const user = await auth?.login(username, password);
    setIsLoggingIn(false);

    if (user) {
        if(user.userType !== type) {
            alert(`Login failed: This user is registered as a ${user.userType}, not a ${type}.`);
            auth?.logout(); // Log them out as the session was set
            return;
        }
        navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-brand-green mb-6 text-center">Login</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent sm:text-sm"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent sm:text-sm"
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            type="button"
            onClick={() => handleLogin('seeker')}
            disabled={isLoggingIn}
            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-brand-light-green hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors disabled:bg-gray-400"
          >
            {isLoggingIn ? 'Logging in...' : 'Login as Job Seeker'}
          </button>
          <button
            type="button"
            onClick={() => handleLogin('provider')}
            disabled={isLoggingIn}
            className="w-full inline-flex justify-center py-3 px-6 border border-brand-green shadow-sm text-base font-medium rounded-full text-brand-green bg-transparent hover:bg-brand-cream focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? 'Logging in...' : 'Login as Job Provider'}
          </button>
        </div>
      </form>
       <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-brand-light-green hover:text-brand-green">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;