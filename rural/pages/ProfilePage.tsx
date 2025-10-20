import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { JobContext } from '../contexts/JobContext';
import { UserProfile, ProviderProfile, Job, Notification } from '../types';
import { UserCircleIcon } from '../components/IconComponents';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const jobContext = useContext(JobContext);

  const [seekerProfile, setSeekerProfile] = useState<UserProfile | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [providerJobs, setProviderJobs] = useState<Job[]>([]);
  const [applicantsMap, setApplicantsMap] = useState<Record<string, string[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Sync local state with context on auth change
    setSeekerProfile(auth?.userProfile || null);
    setProviderProfile(auth?.providerProfile || null);
  }, [auth?.userProfile, auth?.providerProfile]);

  const fetchProviderData = useCallback(async () => {
    if (auth?.userType === 'provider' && auth?.currentUser?.username && jobContext) {
      const allJobs = jobContext.jobs;
      const myJobs = allJobs.filter(job => job.providerUsername === auth.currentUser.username);
      setProviderJobs(myJobs);

      const appMap: Record<string, string[]> = {};
      for (const job of myJobs) {
        appMap[job.id] = await jobContext.getApplicantsForJob(job.id);
      }
      setApplicantsMap(appMap);

      const providerNotifications = await jobContext.getNotificationsForProvider(auth.currentUser.username);
      setNotifications(providerNotifications);
      
      const unreadIds = providerNotifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length > 0) {
          await jobContext.markNotificationsAsRead(unreadIds);
      }
    }
  }, [auth?.userType, auth?.currentUser?.username, jobContext]);
  
  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  const handleSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (seekerProfile) {
        setSeekerProfile({ ...seekerProfile, [e.target.name]: e.target.value });
    }
  };
  
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (providerProfile) {
        setProviderProfile({ ...providerProfile, [e.target.name]: e.target.value });
    }
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (seekerProfile) {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setSeekerProfile({ ...seekerProfile, skills: skillsArray });
    }
  };

  const handleSave = () => {
    if (auth?.userType === 'seeker' && seekerProfile) {
        auth.updateProfile(seekerProfile);
    } else if (auth?.userType === 'provider' && providerProfile) {
        auth.updateProfile(providerProfile);
    }
    setIsEditing(false);
  };
  
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (auth?.userType === 'seeker' && seekerProfile) {
            setSeekerProfile({...seekerProfile, profilePicture: base64String});
        } else if (auth?.userType === 'provider' && providerProfile) {
            setProviderProfile({...providerProfile, profilePicture: base64String});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderProfilePicture = (profile: UserProfile | ProviderProfile | null) => (
    <div className="relative w-32 h-32 mx-auto mb-4">
        {profile?.profilePicture ? (
             <img src={profile.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
        ) : (
            <UserCircleIcon className="w-full h-full text-gray-300"/>
        )}
        {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <label htmlFor="picture-upload" className="text-white text-sm cursor-pointer">
                    Change
                    <input id="picture-upload" type="file" className="hidden" onChange={handlePictureChange} accept="image/*" />
                </label>
            </div>
        )}
    </div>
  );

  const renderSeekerProfile = () => {
    if (!seekerProfile) return null;
    return (
      <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700">Name</label><input type="text" name="name" value={seekerProfile.name} onChange={handleSeekerChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={seekerProfile.email} onChange={handleSeekerChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700">Phone No</label><input type="tel" name="phone" value={seekerProfile.phone} onChange={handleSeekerChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea name="description" value={seekerProfile.description} onChange={handleSeekerChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" rows={4}/></div>
          <div><label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label><input type="text" name="skills" value={seekerProfile.skills.join(', ')} onChange={handleSkillsChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
      </div>
    );
  };
  
  const renderProviderProfile = () => {
    if (!providerProfile) return null;
    return (
       <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Contact Name</label><input type="text" name="name" value={providerProfile.name} onChange={handleProviderChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Company / Business</label><input type="text" name="company" value={providerProfile.company} onChange={handleProviderChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={providerProfile.email} onChange={handleProviderChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Phone No</label><input type="tel" name="phone" value={providerProfile.phone} onChange={handleProviderChange} disabled={!isEditing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white text-brand-green disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light-green focus:border-transparent" /></div>
          </div>
        </div>
    );
  };
  
  const renderProviderNotifications = () => {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-brand-green mb-4 border-b pb-2">Notifications</h2>
             {notifications.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`p-3 rounded-lg border ${notif.read ? 'bg-gray-50' : 'bg-yellow-100 border-yellow-300'}`}>
                           <p className="text-sm text-gray-800">
                                <span className="font-bold">{notif.seekerUsername}</span> applied for your job posting: <Link to={`/job/${notif.jobId}`} className="font-semibold text-brand-light-green hover:underline">{notif.jobTitle}</Link>.
                           </p>
                           <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-gray-500">You have no new notifications.</p>
            )}
        </div>
    )
  }
  
  const renderProviderPostings = () => {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-brand-green mb-4 border-b pb-2">My Job Postings & Applicants</h2>
            {providerJobs.length > 0 ? (
                <div className="space-y-6">
                    {providerJobs.map(job => {
                        const applicants = applicantsMap[job.id] || [];
                        return (
                            <div key={job.id} className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="font-bold text-lg text-brand-light-green">{job.title}</h3>
                                <p className="text-sm text-gray-600">{job.company}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700">Applicants ({applicants.length})</h4>
                                    {applicants.length > 0 ? (
                                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                            {applicants.map((applicant, index) => (
                                                <li key={index} className="text-gray-800">{applicant}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 mt-2">No applicants yet.</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className="text-gray-500">You have not posted any jobs yet.</p>
            )}
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-brand-green mb-6 text-center">My Profile</h1>
            {renderProfilePicture(auth?.userType === 'seeker' ? seekerProfile : providerProfile)}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">{auth?.currentUser?.username}</h2>
                <p className="text-gray-500 capitalize">{auth?.userType} Account</p>
            </div>

            {auth?.userType === 'seeker' ? renderSeekerProfile() : renderProviderProfile()}

            <div className="mt-8 flex justify-end gap-4">
                {isEditing ? (
                <>
                    <button onClick={() => { setIsEditing(false); setSeekerProfile(auth?.userProfile || null); setProviderProfile(auth?.providerProfile || null); }} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-brand-light-green hover:bg-brand-green">Save Changes</button>
                </>
                ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-md text-white bg-brand-light-green hover:bg-brand-green">Edit Profile</button>
                )}
            </div>
        </div>
        
        {auth?.userType === 'provider' && renderProviderNotifications()}
        {auth?.userType === 'provider' && renderProviderPostings()}
    </div>
  );
};

export default ProfilePage;