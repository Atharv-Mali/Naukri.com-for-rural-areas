import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FullTimePage from './pages/FullTimePage';
import PartTimePage from './pages/PartTimePage';
import JobDetailPage from './pages/JobDetailPage';
import AddJobPage from './pages/AddJobPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <JobProvider>
        <div className="flex flex-col min-h-screen bg-brand-beige font-sans">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/full-time" element={<FullTimePage />} />
              <Route path="/part-time" element={<PartTimePage />} />
              <Route path="/job/:jobId" element={<JobDetailPage />} />
              <Route path="/add-job" element={
                <ProtectedRoute allowedUserTypes={['provider']}>
                  <AddJobPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                 <ProtectedRoute allowedUserTypes={['seeker', 'provider']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </JobProvider>
    </AuthProvider>
  );
};

export default App;
