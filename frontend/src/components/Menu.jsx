import React, { useEffect } from 'react';
import './Menu.css'
import {FaSignOutAlt, FaSuitcase} from "react-icons/fa";
import { UserSessionContext } from '../contexts/UserSessionContext';
import {useNavigate} from "react-router-dom"
import api from "./api"

const Menu = () => {
    const {userSessionData, setUserSessionData} = React.useContext(UserSessionContext)
    const navigate = useNavigate()

    const logout = () => {
        api.post('/logout', {}, {
            headers: {
                'Authorization': `Bearer ${userSessionData.accessToken}`
            }
        })
        .then(() => {
            localStorage.removeItem('userSessionData')
            setUserSessionData(null)
            navigate('/login')
        })
    }

    if (!userSessionData) {
        return null
    }
    
    return (
        <>
            <nav className="menu">
                <ul className="menu__list">
                    <li className="menu__list-item"><FaSuitcase className='menu__list-item-icon suitcase-icon active' /></li>
                </ul>
            </nav>
            <div className='logout-button' onClick={logout}>
                <FaSignOutAlt />
            </div>
        </>
    )
}

export default Menu