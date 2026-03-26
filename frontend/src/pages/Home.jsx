import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [recommendations, setRecommendations] = useState([]);
    const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', rating: '' });
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchServices = async () => {
        try {
            let query = `/services?page=${page}&size=6&`;
            if (filters.category) query += `category=${encodeURIComponent(filters.category)}&`;
            if (filters.minPrice) query += `minPrice=${filters.minPrice}&`;
            if (filters.maxPrice) query += `maxPrice=${filters.maxPrice}&`;
            if (filters.rating) query += `rating=${filters.rating}&`;

            const response = await api.get(query);
            setServices(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            console.error("Error fetching services", err);
        }
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get('/recommendations');
                setRecommendations(response.data.data);
            } catch (err) {
                console.error("Error fetching recommendations", err);
            }
        };
        fetchRecommendations();
    }, [user]);

    useEffect(() => {
        fetchServices();
    }, [user, filters, page]);

    const handleBookClick = async (serviceId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'CUSTOMER') {
            alert('Only customers can book services!');
            return;
        }
        try {
            const todayStr = new Date().toLocaleDateString('en-CA');
            await api.post('/bookings', {
                serviceId,
                serviceDate: todayStr
            });
            alert('Booking created successfully!');
        } catch (err) {
            let errorMsg = err.response?.data?.message || 'Error';
            if (err.response?.data?.data) {
                // Parse specific constraints map securely
                errorMsg = Object.values(err.response.data.data).join(' | ');
            }
            alert('Booking failed: ' + errorMsg);
        }
    };

    return (
        <div>
            <div className="p-5 mb-5 bg-white rounded-4 text-center shadow" style={{borderTop: '5px solid #0d6efd'}}>
                <h1 className="display-4 fw-bold text-dark mt-3">Find the perfect service provider</h1>
                <p className="col-md-8 mx-auto fs-5 text-muted mb-4">Book electricians, plumbers, cleaners, and professionals instantly.</p>
                {!user && <button className="btn btn-primary btn-lg rounded-pill px-5 fw-bold" onClick={() => navigate('/register')}>Get Started</button>}
            </div>
            
            {recommendations && recommendations.length > 0 && (
                <>
                    <h3 className="mb-4 fw-bold text-dark mt-5">🌟 Recommended for You</h3>
                    <div className="row mb-5">
                        {recommendations.map(service => (
                            <div className="col-md-4 mb-4" key={"rec-" + service.id}>
                                <div className="card h-100 p-4 border-0 shadow-lg rounded-4" style={{background: 'linear-gradient(145deg, #f8f9fa, #e9ecef)'}}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h4 className="fw-bold mb-0 text-dark">{service.name}</h4>
                                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-bold">Top Pick</span>
                                    </div>
                                    <span className="badge bg-primary rounded-pill px-3 py-2 mb-2 d-inline-block" style={{width: "max-content"}}>{service.category}</span>
                                    <h3 className="text-primary fw-bolder mb-3">${service.price}</h3>
                                    <p className="text-muted small mb-4 fw-bold pb-2 border-bottom">Provided by: {service.providerName}</p>
                                    <button className="btn btn-primary w-100 fw-bold rounded-pill" onClick={() => handleBookClick(service.id)}>Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            <h3 className="mb-4 fw-bold text-dark">Available Services</h3>
            
            <div className="card shadow-sm border-0 mb-4 p-4 rounded-4 bg-light">
                <h5 className="fw-bold mb-3">Filter Services</h5>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold">Category</label>
                        <select className="form-select border-0" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
                            <option value="">All Categories</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Mechanic">Mechanic</option>
                            <option value="IT Support">IT Support</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold">Min Price ($)</label>
                        <input type="number" className="form-control border-0" placeholder="0" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold">Max Price ($)</label>
                        <input type="number" className="form-control border-0" placeholder="1000" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label text-muted small fw-bold">Min Rating</label>
                        <select className="form-select border-0" value={filters.rating} onChange={e => setFilters({...filters, rating: e.target.value})}>
                            <option value="">Any Rating</option>
                            <option value="4.0">4.0+ Stars</option>
                            <option value="3.0">3.0+ Stars</option>
                            <option value="2.0">2.0+ Stars</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                {services.length === 0 ? (
                    <div className="col-12"><p className="text-muted text-center mt-5 fs-5">No services available right now.</p></div>
                ) : (
                    services.map(service => (
                        <div className="col-md-4 mb-4" key={service.id}>
                            <div className="card h-100 p-4 border-0 shadow rounded-4" style={{background: 'linear-gradient(145deg, #ffffff, #f0f2f5)'}}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h4 className="fw-bold mb-0 text-dark">{service.name}</h4>
                                    <span className="badge bg-primary rounded-pill px-3 py-2">{service.category}</span>
                                </div>
                                <h3 className="text-primary fw-bolder mb-3">${service.price}</h3>
                                <p className="text-muted small mb-4 fw-bold pb-2 border-bottom">Provided by: {service.providerName}</p>
                                <button 
                                    className="btn btn-dark w-100 fw-bold rounded-pill" 
                                    onClick={() => handleBookClick(service.id)}>
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-5 mb-4 gap-3">
                    <button className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous Page</button>
                    <span className="fw-bold text-dark bg-white px-4 py-2 rounded-pill shadow border border-light">Page {page + 1} of {totalPages}</span>
                    <button className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next Page</button>
                </div>
            )}
        </div>
    );
};

export default Home;
