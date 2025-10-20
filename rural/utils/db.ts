import { Job, User, UserProfile, ProviderProfile, Application, Notification } from '../types';
import { ALL_JOBS } from '../constants';

const DB_NAME = 'RuralRootsDB';
const DB_VERSION = 1;

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject('Database error');
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'username' });
      }
      if (!db.objectStoreNames.contains('seekerProfiles')) {
        db.createObjectStore('seekerProfiles', { keyPath: 'username' });
      }
      if (!db.objectStoreNames.contains('providerProfiles')) {
        db.createObjectStore('providerProfiles', { keyPath: 'username' });
      }
      if (!db.objectStoreNames.contains('jobs')) {
        const jobsStore = db.createObjectStore('jobs', { keyPath: 'id' });
        // Seed initial jobs
        ALL_JOBS.forEach(job => jobsStore.add(job));
      }
      if (!db.objectStoreNames.contains('applications')) {
        const applicationsStore = db.createObjectStore('applications', { autoIncrement: true });
        applicationsStore.createIndex('jobId_seekerUsername', ['jobId', 'seekerUsername'], { unique: true });
        applicationsStore.createIndex('jobId', 'jobId', { unique: false });

      }
      if (!db.objectStoreNames.contains('notifications')) {
          const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
          notificationsStore.createIndex('providerUsername', 'providerUsername', { unique: false });
      }
    };
  });
};

// Generic function to perform DB operations
const performDbOperation = <T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
    return initDB().then(db => {
        return new Promise<T>((resolve, reject) => {
            const transaction = db.transaction(storeName, mode);
            const store = transaction.objectStore(storeName);
            const request = operation(store);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    });
};


// --- User & Profile Functions ---
export const addUser = (user: User) => performDbOperation('users', 'readwrite', store => store.add(user));
export const getUser = (username: string): Promise<User | undefined> => performDbOperation('users', 'readonly', store => store.get(username));

export const addSeekerProfile = (profile: UserProfile) => performDbOperation('seekerProfiles', 'readwrite', store => store.add(profile));
export const getSeekerProfile = (username: string): Promise<UserProfile | undefined> => performDbOperation('seekerProfiles', 'readonly', store => store.get(username));
export const updateSeekerProfile = (profile: UserProfile) => performDbOperation('seekerProfiles', 'readwrite', store => store.put(profile));

export const addProviderProfile = (profile: ProviderProfile) => performDbOperation('providerProfiles', 'readwrite', store => store.add(profile));
export const getProviderProfile = (username: string): Promise<ProviderProfile | undefined> => performDbOperation('providerProfiles', 'readonly', store => store.get(username));
export const updateProviderProfile = (profile: ProviderProfile) => performDbOperation('providerProfiles', 'readwrite', store => store.put(profile));


// --- Job Functions ---
export const addJob = (job: Job) => performDbOperation('jobs', 'readwrite', store => store.add(job));
export const getJobs = (): Promise<Job[]> => performDbOperation('jobs', 'readonly', store => store.getAll());
export const getJob = (id: string): Promise<Job | undefined> => performDbOperation('jobs', 'readonly', store => store.get(id));

// --- Application Functions ---
export const addApplication = (application: Application) => performDbOperation('applications', 'readwrite', store => store.add(application));

export const hasApplied = (jobId: string, seekerUsername: string): Promise<boolean> => {
    return initDB().then(db => new Promise((resolve, reject) => {
        const transaction = db.transaction('applications', 'readonly');
        const store = transaction.objectStore('applications');
        const index = store.index('jobId_seekerUsername');
        const request = index.count(IDBKeyRange.only([jobId, seekerUsername]));
        request.onsuccess = () => resolve(request.result > 0);
        request.onerror = () => reject(request.error);
    }));
};

export const getApplicantsForJob = (jobId: string): Promise<string[]> => {
    return initDB().then(db => new Promise((resolve, reject) => {
        const transaction = db.transaction('applications', 'readonly');
        const store = transaction.objectStore('applications');
        const index = store.index('jobId');
        const request = index.getAll(IDBKeyRange.only(jobId));
        request.onsuccess = () => {
             const applicants = (request.result as Application[]).map(app => app.seekerUsername);
             resolve(applicants);
        };
        request.onerror = () => reject(request.error);
    }));
};

// --- Notification Functions ---
export const addNotification = (notification: Omit<Notification, 'id'>) => performDbOperation('notifications', 'readwrite', store => store.add(notification));

export const getUnreadNotifications = (providerUsername: string): Promise<Notification[]> => {
    return initDB().then(db => new Promise((resolve, reject) => {
        const transaction = db.transaction('notifications', 'readonly');
        const store = transaction.objectStore('notifications');
        const index = store.index('providerUsername');
        const request = index.getAll(IDBKeyRange.only(providerUsername));
        request.onsuccess = () => {
            const unread = (request.result as Notification[]).filter(n => !n.read);
            resolve(unread);
        };
        request.onerror = () => reject(request.error);
    }));
};

export const markNotificationsAsRead = (notificationIds: number[]): Promise<void> => {
  return initDB().then(db => new Promise((resolve, reject) => {
    const transaction = db.transaction('notifications', 'readwrite');
    const store = transaction.objectStore('notifications');
    let completed = 0;

    notificationIds.forEach(id => {
      const request = store.get(id);
      request.onsuccess = () => {
        const notification: Notification = request.result;
        if (notification) {
          notification.read = true;
          const updateRequest = store.put(notification);
          updateRequest.onsuccess = () => {
              completed++;
              if(completed === notificationIds.length) {
                  resolve();
              }
          };
        } else {
             completed++;
              if(completed === notificationIds.length) {
                  resolve();
              }
        }
      };
      request.onerror = () => reject(request.error);
    });

    transaction.oncomplete = () => {
        if(notificationIds.length === 0) resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  }));
};

export const getNotificationsForProvider = (providerUsername: string): Promise<Notification[]> => {
    return initDB().then(db => new Promise((resolve, reject) => {
        const transaction = db.transaction('notifications', 'readonly');
        const store = transaction.objectStore('notifications');
        const index = store.index('providerUsername');
        const request = index.getAll(IDBKeyRange.only(providerUsername));

        request.onsuccess = () => {
            // Sort by timestamp descending to show newest first
            const sorted = (request.result as Notification[]).sort((a, b) => b.timestamp - a.timestamp);
            resolve(sorted);
        };
        request.onerror = () => reject(request.error);
    }));
};
