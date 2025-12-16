import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  push, 
  update, 
  remove,
  query,
  orderByChild,
  equalTo
} from "firebase/database";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Create an admin email/password in Firebase Console → Authentication
const ADMIN_EMAIL = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = import.meta.env.VITE_FIREBASE_ADMIN_PASSWORD || "admin123";

// Store authentication state
let currentUser = null;
let authListeners = [];

// Initialize authentication
const initAuth = async () => {
  try {
    // Try to sign in with email/password for admin access
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      ADMIN_EMAIL, 
      ADMIN_PASSWORD
    );
    currentUser = userCredential.user;
    console.log("Authenticated as admin:", currentUser.email);
    notifyAuthListeners();
    return { success: true, user: currentUser };
  } catch (error) {
    console.warn("Admin login failed, trying anonymous:", error.message);
    
    // Fallback to anonymous auth for read-only access
    try {
      const anonCredential = await signInAnonymously(auth);
      currentUser = anonCredential.user;
      console.log("Authenticated anonymously");
      notifyAuthListeners();
      return { success: true, user: currentUser, isAnonymous: true };
    } catch (anonError) {
      console.error("All authentication methods failed:", anonError);
      currentUser = null;
      notifyAuthListeners();
      return { success: false, error: anonError };
    }
  }
};

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  notifyAuthListeners();
});

// Notify all auth listeners
const notifyAuthListeners = () => {
  authListeners.forEach(listener => listener(currentUser));
};

// Auth subscription management
const subscribeToAuth = (callback) => {
  authListeners.push(callback);
  callback(currentUser); // Call immediately with current state
  
  return () => {
    const index = authListeners.indexOf(callback);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
};

// Check if user can write (has write permission)
const canWrite = () => {
  return currentUser && !currentUser.isAnonymous;
};

// Secure write operations
const secureWrite = (operation, ...args) => {
  if (!canWrite()) {
    console.warn("Write operation blocked: User not authenticated as admin");
    return Promise.reject(new Error("Permission denied. Admin access required."));
  }
  return operation(...args);
};

// Firebase service functions
export const firebaseService = {
  // Initialize authentication
  init: initAuth,
  
  // Authentication state
  getCurrentUser: () => currentUser,
  subscribeToAuth,
  
  // Check permissions
  canWrite,
  
  // Auth methods
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  loginAnonymously: () => signInAnonymously(auth),
  
  // ========== READ OPERATIONS (Public) ==========
  
  // Read data from a path
  getData: (path, callback) => {
    const dataRef = ref(database, path);
    return onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error("Error reading data:", error);
      callback(null, error);
    });
  },
  
  // Read data once (single fetch)
  getDataOnce: async (path) => {
    const dataRef = ref(database, path);
    try {
      const snapshot = await onValue(dataRef, (snapshot) => {
        return snapshot.val();
      }, { onlyOnce: true });
      return snapshot.val();
    } catch (error) {
      console.error("Error getting data once:", error);
      throw error;
    }
  },
  
  // Query data with filters
  queryData: (path, field, value) => {
    const dataRef = ref(database, path);
    const q = query(dataRef, orderByChild(field), equalTo(value));
    
    return new Promise((resolve, reject) => {
      onValue(q, (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  },
  
  // ========== WRITE OPERATIONS (Protected) ==========
  
  // Set data at a specific path
  setData: (path, data) => {
    const operation = () => {
      const dataRef = ref(database, path);
      return set(dataRef, data);
    };
    return secureWrite(operation);
  },
  
  // Push new data to a list
  pushData: (path, data) => {
    const operation = () => {
      const dataRef = ref(database, path);
      return push(dataRef, data);
    };
    return secureWrite(operation);
  },
  
  // Update specific fields
  updateData: (path, updates) => {
    const operation = () => {
      const dataRef = ref(database, path);
      return update(dataRef, updates);
    };
    return secureWrite(operation);
  },
  
  // Remove data
  removeData: (path) => {
    const operation = () => {
      const dataRef = ref(database, path);
      return remove(dataRef);
    };
    return secureWrite(operation);
  },
  
  // Batch operations
  batchSet: async (updates) => {
    const operation = () => {
      const updatesObj = {};
      Object.entries(updates).forEach(([path, data]) => {
        updatesObj[path] = data;
      });
      return update(ref(database), updatesObj);
    };
    return secureWrite(operation);
  }
};

// Initialize auth on import
initAuth();

export { auth, database };
export default firebaseService;