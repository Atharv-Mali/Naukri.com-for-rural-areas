import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { LocationIcon } from './IconComponents';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Link to={`/job/${job.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 group">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-brand-green group-hover:text-brand-light-green transition-colors">{job.title}</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${job.type === 'full-time' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {job.type.replace('-', ' ')}
        </span>
      </div>
      <p className="text-md text-gray-700 font-semibold mt-1">{job.company}</p>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <LocationIcon className="h-4 w-4 mr-2 flex-shrink-0" />
        <span>{job.location}</span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 truncate">{job.description}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                +{job.skills.length - 3} more
            </span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
