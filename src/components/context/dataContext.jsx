import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';

const UserContext = createContext(null);
const urlUser = "users/"

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        function axiosData() {
            if (sessionStorage.getItem("temp")) {
                axios.get(urlUser + sessionStorage.getItem("temp"), { withCredentials: true })
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    toast.error(error);
                })
            }else{
                setUser(null);
            }
            
        }
        axiosData();
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);