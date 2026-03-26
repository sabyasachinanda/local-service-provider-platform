import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <Link className="navbar-brand" to="/">UrbanService</Link>
                <div className="collapse navbar-collapse d-flex justify-content-end">
                    <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link text-white me-3" to="/">Home</Link>
                        </li>
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white me-2" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-light text-primary fw-bold" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-white fw-bold me-3 d-flex align-items-center">
                                        {user.profileImageUrl ? (
                                            <img src={`${(import.meta.env.VITE_API_URL || 'http://localhost:8082/api').replace('/api', '')}${user.profileImageUrl}`} alt="Profile" className="rounded-circle me-2" style={{width: '30px', height: '30px', objectFit: 'cover'}} />
                                        ) : (
                                            <div className="bg-light text-primary rounded-circle me-2 d-flex justify-content-center align-items-center fw-bold" style={{width: '30px', height: '30px'}}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        Hi, {user.name}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    {user.role === 'ADMIN' && <Link className="btn btn-light text-primary fw-bold me-2" to="/admin-dashboard">Dashboard</Link>}
                                    {user.role === 'SERVICE_PROVIDER' && <Link className="btn btn-light text-primary fw-bold me-2" to="/provider-dashboard">Dashboard</Link>}
                                    {user.role === 'CUSTOMER' && <Link className="btn btn-light text-primary fw-bold me-2" to="/customer-dashboard">Dashboard</Link>}
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light" onClick={logout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
