import React, { createContext, useState } from "react"

export const UserSessionContext = createContext()

export const UserSessionProvider = ({ children }) => {
    const [userSessionData, setUserSessionData] = useState(
        JSON.parse(localStorage.getItem("userSessionData"))
    )

    return (
        <UserSessionContext.Provider value={{ userSessionData, setUserSessionData }}>
            {children}
        </UserSessionContext.Provider>
    )
}