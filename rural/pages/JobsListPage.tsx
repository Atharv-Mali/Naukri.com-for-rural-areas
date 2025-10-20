
import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';

interface JobsListPageProps {
  jobs: Job[];
  title: string;
  description: string;
}

const JobsListPage: React.FC<JobsListPageProps> = ({ jobs, title, description }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = useMemo(() => {
    if (!searchQuery) {
      return jobs;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(lowercasedQuery) ||
        job.company.toLowerCase().includes(lowercasedQuery) ||
        job.location.toLowerCase().includes(lowercasedQuery) ||
        job.skills.some((skill) => skill.toLowerCase().includes(lowercasedQuery))
    );
  }, [jobs, searchQuery]);

  return (
    <div>
      <div className="text-center mb-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-brand-green">{title}</h1>
        <p className="mt-2 text-lg text-gray-600">{description}</p>
      </div>
      <SearchBar onSearch={setSearchQuery} />
      
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-brand-green">No Jobs Found</h2>
            <p className="mt-2 text-gray-500">
                Sorry, we couldn't find any jobs matching your search criteria. Try a different keyword.
            </p>
        </div>
      )}
    </div>
  );
};

export default JobsListPage;
