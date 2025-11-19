import React,{ createContext} from "react";
import { useEffect } from "react";
import { useState } from "react";
import { API_PATHS } from "../utils/apiPaths";
import axiosIntance from "../utils/axiosInstance.js";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");

        if(!accessToken){
            setLoading(false)
            return;
        }

        const fetchUser = async ()=>{
            try{
                const response = await axiosIntance.get(API_PATHS.AUTH.GET_PROFILE, )
                setUser(response.data);
            }
            catch(error){
               console.error("User not authenticated", error);
               clearUser();
            }
            finally{
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        // Do not remove token here; it must remain for authenticated requests
        setLoading(false);
    };

   const clearUser = () => {
       setUser(null);
       localStorage.removeItem("token");
   };

   return (
       <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
           {children}
       </UserContext.Provider>
   );
};

export default UserProvider;

//This file exports a context and a provider component.
//Wrap your app with the Provider