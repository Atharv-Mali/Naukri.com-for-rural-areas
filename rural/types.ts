export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  type: 'full-time' | 'part-time';
  postedDate: string;
  providerUsername: string;
}

export type UserType = 'seeker' | 'provider';

export interface User {
  username: string;
  userType: UserType;
  password?: string; // Storing passwords client-side is for demo purposes only.
}

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  skills: string[];
  profilePicture: string;
}

export interface ProviderProfile {
  username: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  profilePicture: string;
}

export interface Application {
  jobId: string;
  seekerUsername: string;
}

export interface Notification {
    id: number;
    providerUsername: string;
    jobId: string;
    jobTitle: string;
    seekerUsername:string;
    timestamp: number;
    read: boolean;
}
