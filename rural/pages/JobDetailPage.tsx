import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { JobContext } from '../contexts/JobContext';
import { AuthContext } from '../contexts/AuthContext';
import { ProviderProfile, Job } from '../types';
import { LocationIcon, BriefcaseIcon, UserCircleIcon } from '../components/IconComponents';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const jobContext = useContext(JobContext);
  const authContext = useContext(AuthContext);
  
  const [job, setJob] = useState<Job | null | undefined>(undefined);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkApplicationStatus = useCallback(async () => {
    if (jobContext && authContext?.currentUser && jobId) {
      const status = await jobContext.hasApplied(jobId, authContext.currentUser.username);
      setAlreadyApplied(status);
    }
  }, [jobContext, authContext?.currentUser, jobId]);
  
  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      if (jobId && jobContext && authContext) {
        const fetchedJob = await jobContext.getJobById(jobId);
        setJob(fetchedJob);

        if (fetchedJob?.providerUsername) {
            const profile = await authContext.getProviderProfileByUsername(fetchedJob.providerUsername);
            setProviderProfile(profile);
        }
        await checkApplicationStatus();
      }
      setIsLoading(false);
    };

    fetchJobDetails();
  }, [jobId, jobContext, authContext, checkApplicationStatus]);

  if (isLoading) {
    return <div className="text-center p-10">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-brand-green">Job Not Found</h2>
        <p className="mt-2 text-gray-500">
          Sorry, we couldn't find the job you're looking for.
        </p>
        <Link to="/" className="mt-6 inline-block bg-brand-light-green text-white px-6 py-2 rounded-full font-semibold hover:bg-brand-green transition">
          Back to Home
        </Link>
      </div>
    );
  }
  
  const handleApply = async () => {
    if (jobContext && authContext?.currentUser) {
        await jobContext.applyForJob(job, authContext.currentUser.username);
        await checkApplicationStatus();
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Main Job Details */}
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-6">
                <div>
                <h1 className="text-4xl font-extrabold text-brand-green">{job.title}</h1>
                <p className="text-xl text-gray-700 font-semibold mt-1">{job.company}</p>
                </div>
                <span className={`mt-4 md:mt-0 text-lg font-semibold px-4 py-2 rounded-full ${job.type === 'full-time' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {job.type.replace('-', ' ')}
                </span>
            </div>
            
            <div className="flex items-center text-md text-gray-600 mb-6">
                <LocationIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{job.location}</span>
                <span className="mx-4">|</span>
                <BriefcaseIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Job Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.skills.length > 0 && (
                <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                    </span>
                    ))}
                </div>
                </div>
            )}
        </div>

        {/* Provider Details & Apply Button */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-brand-green mb-4 text-center">About the Employer</h2>
                {providerProfile ? (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            {providerProfile.profilePicture ? (
                                <img src={providerProfile.profilePicture} alt={providerProfile.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserCircleIcon className="w-full h-full text-gray-300"/>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold">{providerProfile.name}</h3>
                        <p className="text-gray-600">{providerProfile.company}</p>
                        <div className="mt-4 pt-4 border-t text-left space-y-2 text-sm">
                            <p><span className="font-semibold">Email:</span> {providerProfile.email || 'Not provided'}</p>
                            <p><span className="font-semibold">Phone:</span> {providerProfile.phone || 'Not provided'}</p>
                        </div>
                    </div>
                ) : (
                     <p className="text-center text-gray-500">Provider details not available.</p>
                )}
            </div>

            {authContext?.userType === 'seeker' && (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <button 
                        onClick={handleApply}
                        disabled={alreadyApplied}
                        className="w-full bg-brand-light-green text-white px-10 py-3 rounded-full text-lg font-semibold transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {alreadyApplied ? 'Applied' : 'Apply Now'}
                    </button>
                    {alreadyApplied && <p className="text-sm text-gray-500 mt-2">You have already applied for this job.</p>}
                </div>
            )}
        </div>
    </div>
  );
};

export default JobDetailPage;
