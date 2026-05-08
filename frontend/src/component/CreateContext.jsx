
import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("userId") ? true : false);
  const [userLoading, setUserLoading] = useState(false);

  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [user, setUser] = useState(null);

  useEffect(() => {

    const handleStorage = () => {

      const id = localStorage.getItem("userId");

      setUserId(id);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };

  }, []);



  useEffect(() => {

    const feach = async () => {
      try {
        if (!userId || userId === "undefined" || userId === "null") return console.log("no userId");

        setUserLoading(true);
        const res = await axios.get(`${BackendUrl}/api/patient/signin/${userId}`);
        console.log(res.data);

        if (res.data.success) {
          console.log(res.data.user);
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
      } finally {
        setUserLoading(false);
      }
    }
    feach();
  }, [userId, BackendUrl]);





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
    <AppContext.Provider value={{
      token, setToken, user, setUser, BackendUrl, userId,
      setUserId, backendImg, name, userLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};