import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';

const ProviderDashboard = () => {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(AuthContext);
    
    const [newService, setNewService] = useState({ name: '', category: '', price: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [servicesRes, bookingsRes] = await Promise.all([
                api.get(`/services/provider/${user.id}`),
                api.get('/bookings/provider')
            ]);
            setServices(servicesRes.data.data);
            setBookings(bookingsRes.data.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services', { ...newService, price: parseFloat(newService.price) });
            setNewService({ name: '', category: '', price: '' });
            fetchData();
        } catch (err) {
            alert('Failed to create service: ' + (err.response?.data?.message || 'Error'));
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status?status=${status}`);
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <ProfileHeader title="Provider Dashboard" />
            
            <div className="row mb-5 mt-4">
                <div className="col-md-5">
                    <div className="card shadow border-0 p-4 rounded-4 bg-white">
                        <h4 className="fw-bold mb-4">Add New Service</h4>
                        <form onSubmit={handleCreateService}>
                            <div className="mb-3">
                                <label className="form-label text-muted fw-bold small">Service Name</label>
                                <input type="text" className="form-control bg-light border-0" required value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted fw-bold small">Category</label>
                                <input type="text" className="form-control bg-light border-0" required value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-muted fw-bold small">Price ($)</label>
                                <input type="number" step="0.01" className="form-control bg-light border-0" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 fw-bold rounded-pill">Create Service</button>
                        </form>
                    </div>
                </div>
                
                <div className="col-md-7">
                    <div className="card shadow border-0 p-4 rounded-4 bg-white h-100">
                        <h4 className="fw-bold mb-4">My Services</h4>
                        {services.length === 0 ? <p className="text-muted">No services provided.</p> : (
                            <ul className="list-group list-group-flush">
                                {services.map(s => (
                                    <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-0 border-light">
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark">{s.name}</h6>
                                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">{s.category}</span>
                                        </div>
                                        <span className="text-dark fw-bold fs-5">${s.price}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="card shadow border-0 p-4 rounded-4 mt-4 bg-white mb-5">
                <h4 className="fw-bold mb-4">Booking Requests</h4>
                {bookings.length === 0 ? <p className="text-muted">No booking requests yet.</p> : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0">Service</th>
                                    <th className="border-0">Customer</th>
                                    <th className="border-0">Date</th>
                                    <th className="border-0">Status</th>
                                    <th className="border-0 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="border-top-0">
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td className="fw-bold">{b.serviceName}</td>
                                        <td>{b.customerName}</td>
                                        <td>{b.serviceDate}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${b.status === 'PENDING' ? 'bg-warning text-dark' : b.status === 'COMPLETED' ? 'bg-success' : b.status === 'CANCELLED' ? 'bg-danger' : b.status === 'REJECTED' ? 'bg-secondary' : 'bg-primary'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            {b.status === 'PENDING' && (
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-success fw-bold" onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}>Accept</button>
                                                    <button className="btn btn-sm btn-danger fw-bold" onClick={() => updateBookingStatus(b.id, 'REJECTED')}>Reject</button>
                                                </div>
                                            )}
                                            {b.status === 'CONFIRMED' && (
                                                <button className="btn btn-sm btn-outline-primary fw-bold rounded-pill px-3" onClick={() => updateBookingStatus(b.id, 'COMPLETED')}>Mark Completed</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;
