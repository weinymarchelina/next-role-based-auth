import { createContext, useContext, useState } from "react";
export const RoleContext = createContext();
export const BusinessContext = createContext();

export const useRole = () => {
  return useContext(RoleContext);
};
export const useBusiness = () => {
  return useContext(BusinessContext);
};

export const GlobalProvider = ({ children }) => {
  const [role, setRole] = useState("Employee");
  const [business, setBusiness] = useState(null);

  return (
    <RoleContext.Provider value={[role, setRole]}>
      <BusinessContext.Provider value={[business, setBusiness]}>
        {children}
      </BusinessContext.Provider>
    </RoleContext.Provider>
  );
};
