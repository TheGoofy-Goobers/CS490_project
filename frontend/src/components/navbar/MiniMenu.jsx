import { useState, React } from 'react';
import './MiniMenu.css';
import { Logout } from '../../vars';
import { Link } from 'react-router-dom';

const handleLogout = (e) => {
    e.preventDefault();
    Logout();
};

const MiniMenuComponent = () => {

    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="mini-menu">
            <ul>
                <li className='user'>{localStorage.getItem("username")}</li>
                <li onMouseEnter={() => setShowAccountMenu(true)}
                >
                    <Link className="acc-button">Account Management</Link>
                    {showAccountMenu && (
                        <div className="account-management-menu">
                            <ul>
                                <li className="change-user-li"><Link to="/accountmanagement/changeusername" className="acc-button">Edit Username</Link></li>
                                <li><Link to="/accountmanagement/changepassword" className="acc-button">Edit Password</Link></li>
                                <li className="acc-button"><Link to="/accountmanagement/deleteaccount" className="acc-button">Delete Account</Link></li>
                                <li className="delete-account-li"><Link to="/accountmanagement/twoFA" className="acc-button">too fak ter aw thenti fik ayshon</Link></li>
                            </ul>
                        </div>
                    )}
                </li>
                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </ul>
        </div>
    );
};

export default MiniMenuComponent;
