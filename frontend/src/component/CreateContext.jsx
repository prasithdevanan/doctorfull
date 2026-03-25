
import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const store = localStorage.getItem("token");
    return store ? JSON.parse(store) : false;
  });

  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};