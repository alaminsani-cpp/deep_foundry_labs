import { useState, useEffect, useCallback } from 'react';
import { firebaseService } from './fb.js';

const useFirebaseData = (path, defaultValue = [], options = {}) => {
  const { once = false, listen = true } = options;
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [writeEnabled, setWriteEnabled] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (once) {
        // Single fetch
        const snapshotData = await firebaseService.getDataOnce(path);
        if (snapshotData) {
          const dataArray = convertToArray(snapshotData);
          setData(dataArray);
        } else {
          setData(defaultValue);
        }
      } else if (listen) {
        // Real-time listener
        const unsubscribe = firebaseService.getData(path, (snapshotData, err) => {
          if (err) {
            setError(err);
            setLoading(false);
            return;
          }

          if (snapshotData) {
            const dataArray = convertToArray(snapshotData);
            setData(dataArray);
          } else {
            setData(defaultValue);
          }
          setLoading(false);
        });

        // Return cleanup function
        return unsubscribe;
      }
    } catch (err) {
      setError(err);
      setData(defaultValue);
    } finally {
      if (once || !listen) {
        setLoading(false);
      }
    }
  }, [path, defaultValue, once, listen]);

  // Convert Firebase object to array
  const convertToArray = (snapshotData) => {
    if (!snapshotData) return [];
    
    if (typeof snapshotData === 'object' && !Array.isArray(snapshotData)) {
      return Object.keys(snapshotData).map(key => ({
        id: key,
        ...snapshotData[key]
      }));
    }
    return snapshotData;
  };

  // Check write permissions
  useEffect(() => {
    const checkWritePermissions = () => {
      const canWrite = firebaseService.canWrite();
      setWriteEnabled(canWrite);
    };

    // Check initially
    checkWritePermissions();

    // Subscribe to auth changes
    const unsubscribe = firebaseService.subscribeToAuth(() => {
      checkWritePermissions();
    });

    return unsubscribe;
  }, []);

  // Fetch data
  useEffect(() => {
    let unsubscribe;
    
    const loadData = async () => {
      if (once || !listen) {
        await fetchData();
      } else {
        unsubscribe = await fetchData();
      }
    };

    loadData();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchData, once, listen]);

  // Helper functions for write operations
  const addItem = async (itemData) => {
    if (!writeEnabled) {
      throw new Error('Write permissions required');
    }
    return firebaseService.pushData(path, itemData);
  };

  const updateItem = async (itemId, updates) => {
    if (!writeEnabled) {
      throw new Error('Write permissions required');
    }
    return firebaseService.updateData(`${path}/${itemId}`, updates);
  };

  const deleteItem = async (itemId) => {
    if (!writeEnabled) {
      throw new Error('Write permissions required');
    }
    return firebaseService.removeData(`${path}/${itemId}`);
  };

  const setItem = async (itemId, itemData) => {
    if (!writeEnabled) {
      throw new Error('Write permissions required');
    }
    return firebaseService.setData(`${path}/${itemId}`, itemData);
  };

  return {
    data,
    loading,
    error,
    writeEnabled,
    refresh: fetchData,
    addItem,
    updateItem,
    deleteItem,
    setItem,
    setData
  };
};

export default useFirebaseData;