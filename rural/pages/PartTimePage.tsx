import React, { useContext } from 'react';
import JobsListPage from './JobsListPage';
import { JobContext } from '../contexts/JobContext';

const PartTimePage: React.FC = () => {
  const jobContext = useContext(JobContext);
  const partTimeJobs = jobContext?.jobs.filter((job) => job.type === 'part-time') || [];

  return (
    <JobsListPage
      jobs={partTimeJobs}
      title="Part-Time & Seasonal Work"
      description="Find flexible roles that fit your schedule, from seasonal harvests to weekend markets."
    />
  );
};

export default PartTimePage;
