import { useState, React } from 'react';
import './MiniMenu.css';
import { Logout } from '../../vars';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MiniMenuComponent = () => {
    const navigate = useNavigate()
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        Logout(navigate);
    };

    
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
                                <li className="delete-account-li"><Link to="/accountmanagement/deleteaccount" className="acc-button">Delete Account</Link></li>
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
