import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileHeader from '../components/ProfileHeader';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchAnalytics();
    }, [page]);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalytics(response.data.data);
        } catch (err) {
            console.error("Error fetching analytics", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get(`/admin/users?page=${page}&size=10`);
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.put(`/admin/users/${id}/toggle-status`);
            fetchUsers();
        } catch (err) {
            alert('Failed to update user status');
        }
    }

    return (
        <div>
            <ProfileHeader title="Admin Dashboard" />
            
            <div className="row mt-4 mb-2">
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-primary shadow-sm rounded-4 h-100 p-3 border-0 bg-gradient">
                        <div className="card-body">
                            <h5 className="card-title fw-bold opacity-75">Total Users</h5>
                            <p className="display-4 fw-bold mb-0">{analytics?.totalUsers || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-dark bg-warning shadow-sm rounded-4 h-100 p-3 border-0 bg-gradient">
                        <div className="card-body">
                            <h5 className="card-title fw-bold opacity-75">Total Bookings</h5>
                            <p className="display-4 fw-bold mb-0">{analytics?.totalBookings || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-success shadow-sm rounded-4 h-100 p-3 border-0 bg-gradient">
                        <div className="card-body">
                            <h5 className="card-title fw-bold opacity-75">Total Revenue</h5>
                            <p className="display-4 fw-bold mb-0">${analytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow border-0 p-4 rounded-4 mt-4 bg-white mb-5">
                <h4 className="fw-bold mb-4">User Management</h4>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="border-0">Name</th>
                                <th className="border-0">Email</th>
                                <th className="border-0">Role</th>
                                <th className="border-0 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="border-top-0">
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="fw-bold">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">{u.role}</span></td>
                                    <td className="text-end">
                                        <button className={`btn btn-sm fw-bold rounded-pill px-4 btn-outline-danger`} onClick={() => toggleStatus(u.id)}>
                                            Toggle Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button className="btn btn-outline-primary fw-bold px-4 rounded-pill" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                        <span className="fw-bold text-muted bg-light px-4 py-2 rounded-pill">Page {page + 1} of {totalPages}</span>
                        <button className="btn btn-outline-primary fw-bold px-4 rounded-pill" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
