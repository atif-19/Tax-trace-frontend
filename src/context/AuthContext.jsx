import React, { createContext, useState, useEffect } from 'react';

// 1. Create the 'Cloud' (Context)
export const AuthContext = createContext(); // context help so that each component can access the data from here we do not have to pass toekn to each thing

// this function provides the context
export const AuthProvider = ({ children }) => {

    // this is user state
    // so whenever the user state changes the part of the screen re renders where user state is used
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. On Startup: Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // For now, we assume if a token exists, the user is logged in.
            // Later, we can fetch user details from the /auth/me profile.
            setUser({ loggedIn: true });
        }
        setLoading(false); // we set loading to false when the component mounts
    }, []);

    // 3. Login function
    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ loggedIn: true });
    };

    // 4. Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        // 5. Wrap the app in the Provider and share the 'user', 'login', and 'logout'
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};