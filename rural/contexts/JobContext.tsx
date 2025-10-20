import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Job, Application, Notification } from '../types';
import * as db from '../utils/db';
import { AuthContext } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  isLoading: boolean;
  notifications: Notification[];
  addJob: (job: Job) => Promise<void>;
  getJobById: (id: string) => Promise<Job | undefined>;
  applyForJob: (job: Job, seekerUsername: string) => Promise<void>;
  hasApplied: (jobId: string, seekerUsername: string) => Promise<boolean>;
  getApplicantsForJob: (jobId: string) => Promise<string[]>;
  fetchNotifications: () => Promise<void>;
  markNotificationsAsRead: (notificationIds: number[]) => Promise<void>;
  getNotificationsForProvider: (username: string) => Promise<Notification[]>;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        await db.initDB();
        const storedJobs = await db.getJobs();
        setJobs(storedJobs);
      } catch (error) {
        console.error("Failed to load jobs from DB", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);
  
  const fetchNotifications = async () => {
      if (authContext?.currentUser?.userType === 'provider') {
          const fetchedNotifications = await db.getUnreadNotifications(authContext.currentUser.username);
          setNotifications(fetchedNotifications);
      }
  };
  
  useEffect(() => {
      fetchNotifications();
  }, [authContext?.currentUser]);

  const addJob = async (job: Job) => {
    await db.addJob(job);
    const updatedJobs = await db.getJobs();
    setJobs(updatedJobs);
  };

  const getJobById = async (id: string): Promise<Job | undefined> => {
    return db.getJob(id);
  };
  
  const applyForJob = async (job: Job, seekerUsername: string) => {
    if (await hasApplied(job.id, seekerUsername)) {
        alert("You have already applied for this job.");
        return;
    }
    const newApplication: Application = { jobId: job.id, seekerUsername };
    await db.addApplication(newApplication);

    const newNotification: Omit<Notification, 'id'> = {
        providerUsername: job.providerUsername,
        jobId: job.id,
        jobTitle: job.title,
        seekerUsername: seekerUsername,
        timestamp: Date.now(),
        read: false,
    };
    await db.addNotification(newNotification);

    alert("Application submitted successfully!");
  };

  const hasApplied = async (jobId: string, seekerUsername: string): Promise<boolean> => {
    return db.hasApplied(jobId, seekerUsername);
  };

  const getApplicantsForJob = async (jobId: string): Promise<string[]> => {
    return db.getApplicantsForJob(jobId);
  };
  
  const markNotificationsAsRead = async (notificationIds: number[]) => {
      await db.markNotificationsAsRead(notificationIds);
      await fetchNotifications();
  }

  const getNotificationsForProvider = async (username: string): Promise<Notification[]> => {
    return db.getNotificationsForProvider(username);
  }

  const value = {
    jobs,
    isLoading,
    notifications,
    addJob,
    getJobById,
    applyForJob,
    hasApplied,
    getApplicantsForJob,
    fetchNotifications,
    markNotificationsAsRead,
    getNotificationsForProvider,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
