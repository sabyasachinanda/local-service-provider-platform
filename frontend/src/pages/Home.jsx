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
        <div className="pb-5">
            {/* HERO BANNER SECTION */}
            <div className="hero-gradient rounded-4 position-relative shadow-lg animate-fade-in-up" style={{ minHeight: '480px', marginTop: '20px' }}>
                <img src="/images/hero.png" alt="Hero Background" className="position-absolute w-100 h-100" style={{ objectFit: 'cover', opacity: 0.35, top: 0, left: 0, zIndex: 0 }} />
                <div className="position-relative z-index-1 text-center text-white d-flex flex-column justify-content-center align-items-center h-100" style={{ zIndex: 2, paddingTop: '100px' }}>
                    <h1 className="display-2 fw-bolder mb-3" style={{ textShadow: '0 8px 16px rgba(0,0,0,0.5)', letterSpacing: '-1.5px' }}>Transform Your Home. <br /> Instantly.</h1>
                    <p className="fs-4 fw-light mb-0" style={{ opacity: 0.9 }}>Premium, verified local professionals at your fingertips.</p>
                </div>
            </div>

            {/* FLOATING SEARCH BAR */}
            <div className="container position-relative search-bar-floating animate-fade-in-up px-3 py-2" style={{ marginTop: '-45px', maxWidth: '850px' }}>
                <div className="row w-100 g-2 align-items-center m-0">
                    <div className="col-md-8 border-end">
                         <input type="text" className="form-control form-control-lg border-0 bg-transparent shadow-none fw-bold text-dark" placeholder="What do you need help with?" style={{ fontSize: '1.25rem' }} value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} />
                    </div>
                    <div className="col-md-4 text-end">
                         <button className="premium-btn w-100 py-3 fs-5" onClick={fetchServices}>Search Services</button>
                    </div>
                </div>
            </div>

            {/* CATEGORY PILLS */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-5 pt-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="category-pill" onClick={() => setFilters({...filters, category: 'Cleaning'})}>
                    <img src="/images/cleaning.png" alt="Cleaning" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
                    Home Cleaning
                </div>
                <div className="category-pill" onClick={() => setFilters({...filters, category: 'Plumbing'})}>
                    <img src="/images/plumbing.png" alt="Plumbing" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
                    Plumbing Experts
                </div>
                <div className="category-pill" onClick={() => setFilters({...filters, category: 'Electrical'})}>
                    <img src="/images/electrical.png" alt="Electrical" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
                    Electrical Repair
                </div>
            </div>
            
            {/* RECOMMENDED SERVICES */}
            {recommendations && recommendations.length > 0 && (
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', marginTop: '80px' }}>
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <h2 className="fw-bolder text-dark mb-0" style={{ color: 'var(--primary-color)' }}>🌟 Top Rated Near You</h2>
                        <a href="#all-services" className="text-decoration-none fw-bold" style={{ color: 'var(--accent-color)' }}>See all →</a>
                    </div>
                    <div className="row mb-5 g-4">
                        {recommendations.map((service, idx) => (
                            <div className="col-md-4" key={"rec-" + service.id} style={{ animationDelay: `${0.1 * idx}s` }}>
                                <div className="premium-card p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <h4 className="fw-bolder mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{service.name}</h4>
                                        <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: 'rgba(0, 210, 137, 0.15)', color: 'var(--accent-hover)' }}>🔥 Top Pick</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-4">
                                        <span className="badge bg-light text-dark rounded-pill px-3 py-2 border shadow-sm">{service.category}</span>
                                    </div>
                                    <h2 className="fw-black mb-1" style={{ color: 'var(--primary-color)', fontWeight: 900 }}>${service.price}</h2>
                                    <p className="text-muted small mb-4 fw-bold pb-3 border-bottom d-flex align-items-center gap-2">
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-color), var(--primary-color))' }}></div>
                                        {service.providerName}
                                    </p>
                                    <button className="premium-btn w-100 shadow-none" onClick={() => handleBookClick(service.id)}>Book Instantly</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* ALL SERVICES GRID */}
            <div id="all-services" className="d-flex justify-content-between align-items-end mb-4 mt-5 pt-4">
                <h2 className="fw-bolder text-dark mb-0" style={{ color: 'var(--primary-color)' }}>Explore Services</h2>
            </div>
            
            <div className="row g-4 mb-5">
                {services.length === 0 ? (
                    <div className="col-12">
                        <div className="p-5 text-center bg-white rounded-4 shadow-sm border border-light">
                            <h4 className="fw-bold text-muted">No services found matching your criteria.</h4>
                            <p className="text-muted mb-0">Try adjusting your filters or category selection above.</p>
                        </div>
                    </div>
                ) : (
                    services.map((service, idx) => (
                        <div className="col-md-4 animate-fade-in-up" key={service.id} style={{ animationDelay: `${0.05 * idx}s` }}>
                            <div className="premium-card p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>{service.name}</h4>
                                </div>
                                <div className="mb-4">
                                    <span className="badge bg-light text-muted border px-3 py-2 rounded-pill fw-bold">{service.category}</span>
                                </div>
                                <h2 className="fw-black mb-2" style={{ color: 'var(--primary-color)', fontWeight: 800 }}>${service.price}</h2>
                                <p className="text-muted small mb-4 fw-medium border-bottom pb-3">Provider: <strong>{service.providerName}</strong></p>
                                <button className="premium-btn-outline w-100" onClick={() => handleBookClick(service.id)}>
                                    Reserve
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-5 mb-4 gap-4 animate-fade-in-up">
                    <button className="premium-btn-outline px-4" disabled={page === 0} onClick={() => setPage(page - 1)}>← Previous</button>
                    <span className="fw-bold text-dark px-4 py-2 rounded-pill" style={{ background: 'white', boxShadow: 'var(--shadow-sm)' }}>Page {page + 1} of {totalPages}</span>
                    <button className="premium-btn px-4 shadow-none" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default Home;
