import './Menu.css'
import {FaSuitcase} from "react-icons/fa";

const Menu = () => {
    return (
        <nav className="menu">
            <ul className="menu__list">
                <li className="menu__list-item"><FaSuitcase className='menu__list-item-icon suitcase-icon active' /></li>
            </ul>
        </nav>
    )
}

export default Menu