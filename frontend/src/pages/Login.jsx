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
        <div className="row justify-content-center mt-5">
            <div className="col-md-5">
                <div className="card shadow border-0 p-5 rounded-4">
                    <h2 className="text-center mb-4 text-primary fw-bold">Welcome Back</h2>
                    {error && <div className="alert alert-danger rounded-3">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Email</label>
                            <input type="email" required className="form-control form-control-lg bg-light border-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Password</label>
                            <input type="password" required className="form-control form-control-lg bg-light border-0" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold rounded-3 mt-2">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
