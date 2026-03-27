import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
        }
    };

    return (
        <div className="row justify-content-center py-5" style={{ minHeight: 'calc(100vh - 100px)', alignItems: 'center' }}>
            <div className="col-md-5">
                <div className="premium-card p-5 animate-fade-in-up" style={{ borderRadius: '24px' }}>
                    <div className="text-center mb-5">
                        <h2 className="fw-bolder mb-2" style={{ color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>Welcome Back</h2>
                        <p className="text-muted fw-medium">Sign in to your premium account</p>
                    </div>
                    {error && <div className="alert bg-danger text-white border-0 rounded-3 shadow-sm">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label text-dark fw-bold small text-uppercase">Email Address</label>
                            <input type="email" required className="form-control form-control-lg bg-light border-0 shadow-none px-4 py-3 rounded-3 fw-medium" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-5">
                            <label className="form-label text-dark fw-bold small text-uppercase">Password</label>
                            <input type="password" required className="form-control form-control-lg bg-light border-0 shadow-none px-4 py-3 rounded-3 fw-medium" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="premium-btn w-100 py-3 fs-5">Sign In Securely</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
