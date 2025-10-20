import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../contexts/JobContext';
import { AuthContext } from '../contexts/AuthContext';
import { Job } from '../types';

const AddJobPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [type, setType] = useState<'full-time' | 'part-time'>('full-time');
  
  const jobContext = useContext(JobContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !location || !description || !authContext?.currentUser?.username) {
      alert('Please fill out all required fields.');
      return;
    }

    const newJob: Job = {
      id: new Date().toISOString(),
      title,
      company,
      location,
      description,
      skills: skills.split(',').map(skill => skill.trim()).filter(Boolean),
      type,
      postedDate: new Date().toISOString().split('T')[0],
      providerUsername: authContext.currentUser.username,
    };
    
    jobContext?.addJob(newJob);
    alert('Job posted successfully!');
    navigate(type === 'full-time' ? '/full-time' : '/part-time');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-brand-green mb-6 text-center">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent"
          />
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">Job Type</legend>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center">
              <input
                id="full-time"
                name="jobType"
                type="radio"
                value="full-time"
                checked={type === 'full-time'}
                onChange={() => setType('full-time')}
                className="focus:ring-brand-light-green h-4 w-4 text-brand-light-green border-gray-300"
              />
              <label htmlFor="full-time" className="ml-3 block text-sm font-medium text-gray-700">
                Full-Time
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="part-time"
                name="jobType"
                type="radio"
                value="part-time"
                checked={type === 'part-time'}
                onChange={() => setType('part-time')}
                className="focus:ring-brand-light-green h-4 w-4 text-brand-light-green border-gray-300"
              />
              <label htmlFor="part-time" className="ml-3 block text-sm font-medium text-gray-700">
                Part-Time
              </label>
            </div>
          </div>
        </fieldset>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-brand-light-green hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobPage;