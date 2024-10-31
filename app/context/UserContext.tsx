"use client"; // Add this directive at the top

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the UserContextType
type UserContextType = {
  userUid: string | null;
  setUserUid: React.Dispatch<React.SetStateAction<string | null>>;
};

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a UserProvider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userUid, setUserUid] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userUid, setUserUid }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
