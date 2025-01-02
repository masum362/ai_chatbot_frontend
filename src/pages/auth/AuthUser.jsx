import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/user.context'
import { Navigate, useLocation } from 'react-router-dom'

const AuthUser = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const location = useLocation();
    if (loading) {
        return <div>Loading...</div>
    }
    if (user) return children;
    else return <Navigate to="/login" state={location.pathname} />

}

export default AuthUser