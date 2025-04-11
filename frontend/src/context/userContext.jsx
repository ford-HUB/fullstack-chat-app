import React from "react";
import { createContext, useContext } from "react";

const UserContext = createContext()

// custom hooks
export const useUser = () => useContext(UserContext)

// component provider

export const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(null)

    const updateUser = (user) => {
        setUser(user)
    }

    return (
        <>
            <UserContext.Provider value={{ user, updateUser }}>
                {children}
            </UserContext.Provider>
        </>
    )
}