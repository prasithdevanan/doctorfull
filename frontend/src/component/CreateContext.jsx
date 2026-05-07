
import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("userId") ? true : false);

  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  },[])

  useEffect(() => {
    if (!userId || userId === "undefined" || userId === "null") return;
    const feach = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/patient/signin/${userId}`);
        console.log(res.data);
        if (res.data.success) {
          setToken(true);
          setUser(res.data.user);
        } else {
          setToken(false);
          localStorage.removeItem("userId");
        }

      } catch (error) {
        console.log(error.message);
        setToken(false);
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("id");
      }
    }
    feach();
  }, [userId]);





  useEffect(() => {
    const fech = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/admin/logo`);
        if (res.data.success) {
          setBackendImg(res.data.logo.image);
          setName(res.data.logo.name);
        }


      } catch (error) {
        console.log(error);
      }
    }
    fech();
  }, [BackendUrl]);

  const [backendImg, setBackendImg] = useState(null);
  const [name, setName] = useState(null);



  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, BackendUrl, userId, user, backendImg, name }}>
      {children}
    </AppContext.Provider>
  );
};