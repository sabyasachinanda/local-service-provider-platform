import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password, role });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow border-0 p-5 rounded-4">
                    <h2 className="text-center mb-4 text-primary fw-bold">Create Account</h2>
                    {error && <div className="alert alert-danger rounded-3">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Full Name</label>
                            <input type="text" required className="form-control form-control-lg bg-light border-0" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Email</label>
                            <input type="email" required className="form-control form-control-lg bg-light border-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Password</label>
                            <input type="password" required className="form-control form-control-lg bg-light border-0" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-5">
                            <label className="form-label text-muted fw-bold">I want to:</label>
                            <select className="form-select form-select-lg bg-light border-0" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="CUSTOMER">Book Services as a Customer</option>
                                <option value="SERVICE_PROVIDER">Offer Services as a Provider</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold rounded-3">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
