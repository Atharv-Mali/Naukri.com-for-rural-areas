import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserType } from '../types';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('seeker');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      alert('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    setIsSigningUp(true);
    const user = await auth?.signup(username, password, userType);
    setIsSigningUp(false);
    
    if (user) {
        alert('Sign up successful! You are now logged in.');
        navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-brand-green mb-6 text-center">Create an Account</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent sm:text-sm"
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent sm:text-sm"
            required
            autoComplete="new-password"
          />
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">I am a...</legend>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center">
              <input
                id="seeker"
                name="userType"
                type="radio"
                value="seeker"
                checked={userType === 'seeker'}
                onChange={() => setUserType('seeker')}
                className="focus:ring-brand-light-green h-4 w-4 text-brand-light-green border-gray-300"
              />
              <label htmlFor="seeker" className="ml-3 block text-sm font-medium text-gray-700">
                Job Seeker
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="provider"
                name="userType"
                type="radio"
                value="provider"
                checked={userType === 'provider'}
                onChange={() => setUserType('provider')}
                className="focus:ring-brand-light-green h-4 w-4 text-brand-light-green border-gray-300"
              />
              <label htmlFor="provider" className="ml-3 block text-sm font-medium text-gray-700">
                Job Provider
              </label>
            </div>
          </div>
        </fieldset>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-brand-light-green hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors disabled:bg-gray-400"
          >
            {isSigningUp ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>
       <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-light-green hover:text-brand-green">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;