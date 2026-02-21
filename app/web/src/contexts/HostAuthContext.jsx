import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const HostAuthContext = createContext();

export const useHostAuth = () => useContext(HostAuthContext);

export const HostAuthProvider = ({ children }) => {
  const [hostUser, setHostUser] = useState(
    pb.authStore.model?.collectionName === 'hostAccount' ? pb.authStore.model : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (model?.collectionName === 'hostAccount') {
        setHostUser(model);
      } else {
        setHostUser(null);
      }
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('hostAccount').authWithPassword(email, password);
    setHostUser(authData.record);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setHostUser(null);
  };

  const value = {
    hostUser,
    isHostAuthenticated: !!hostUser,
    login,
    logout,
  };

  return (
    <HostAuthContext.Provider value={value}>
      {!loading && children}
    </HostAuthContext.Provider>
  );
};
