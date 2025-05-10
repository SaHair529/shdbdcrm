import React, { useEffect } from 'react';
import './Menu.css'
import {FaSuitcase} from "react-icons/fa";
import { UserSessionContext } from '../contexts/UserSessionContext';

const Menu = () => {
    const {userSessionData} = React.useContext(UserSessionContext)

    if (!userSessionData) {
        return null
    }
    
    return (
        <nav className="menu">
            <ul className="menu__list">
                <li className="menu__list-item"><FaSuitcase className='menu__list-item-icon suitcase-icon active' /></li>
            </ul>
        </nav>
    )
}

export default Menu