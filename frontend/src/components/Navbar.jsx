import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg glass-navbar sticky-top py-3">
            <div className="container">
                <Link className="navbar-brand text-dark fs-4 fw-bolder" to="/">
                    Home<span style={{ color: 'var(--accent-color)' }}>Fix</span>
                </Link>
                <button className="navbar-toggler shadow-none border-0 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav mb-2 mb-lg-0 align-items-lg-center gap-2 mt-3 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-dark fw-semibold me-3 px-3" to="/">Home</Link>
                        </li>
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark fw-semibold me-2" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="premium-btn text-decoration-none shadow-sm" to="/register">Get Started</Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <>
                                <li className="nav-item me-3">
                                    <span className="nav-link text-dark fw-bold d-flex align-items-center">
                                        {user.profileImageUrl ? (
                                            <img src={`${(import.meta.env.VITE_API_URL || 'http://localhost:8082/api').replace('/api', '')}${user.profileImageUrl}`} alt="Profile" className="rounded-circle me-2 shadow-sm" style={{width: '32px', height: '32px', objectFit: 'cover'}} />
                                        ) : (
                                            <div className="text-white rounded-circle me-2 d-flex justify-content-center align-items-center fw-bold shadow-sm" style={{width: '32px', height: '32px', background: 'linear-gradient(45deg, var(--accent-color), var(--primary-color))'}}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        Hi, {user.name}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    {user.role === 'ADMIN' && <Link className="premium-btn-outline text-decoration-none me-2" to="/admin-dashboard">Dashboard</Link>}
                                    {user.role === 'SERVICE_PROVIDER' && <Link className="premium-btn-outline text-decoration-none me-2" to="/provider-dashboard">Dashboard</Link>}
                                    {user.role === 'CUSTOMER' && <Link className="premium-btn-outline text-decoration-none me-2" to="/customer-dashboard">Dashboard</Link>}
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link text-muted fw-bold text-decoration-none p-0 ms-2" onClick={logout}>Logout</button>
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
