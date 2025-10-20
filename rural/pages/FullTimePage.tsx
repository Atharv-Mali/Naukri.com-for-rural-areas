import React, { useContext } from 'react';
import JobsListPage from './JobsListPage';
import { JobContext } from '../contexts/JobContext';

const FullTimePage: React.FC = () => {
  const jobContext = useContext(JobContext);
  const fullTimeJobs = jobContext?.jobs.filter((job) => job.type === 'full-time') || [];

  return (
    <JobsListPage
      jobs={fullTimeJobs}
      title="Full-Time Opportunities"
      description="Explore stable, long-term career paths in the agricultural sector."
    />
  );
};

export default FullTimePage;
