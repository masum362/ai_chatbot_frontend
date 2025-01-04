import { createContext, useEffect, useState } from "react";
import useAxiosInstance from "../config/useAxiosInstance";

export const UserContext = createContext();


const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const axios = useAxiosInstance();
  useEffect(() => {

    const getUser = async () => {
      try {
        const response = await axios.get('/api/users/user')

        if (response.status === 200) {
          setUser(response.data.user)
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
        setLoading(false);

      }
    }
    getUser();
  }, [])
  console.log(user);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider >
  )
}

export default UserProvider