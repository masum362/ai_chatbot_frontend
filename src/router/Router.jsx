import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import Login from '../pages/login/Login'
import Register from '../pages/register/Register'
import Project from '../pages/project/Project'
import AuthUser from '../pages/auth/AuthUser'


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthUser><Home /></AuthUser>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/project" element={<Project />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router