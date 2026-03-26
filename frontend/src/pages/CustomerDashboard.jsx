import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';

const CustomerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/customer');
                setBookings(response.data.data);
            } catch (err) {
                console.error("Error fetching bookings", err);
            }
        };
        fetchBookings();
    }, []);

    const cancelBooking = async (id) => {
        try {
            await api.put(`/bookings/${id}/status?status=CANCELLED`);
            setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        } catch (err) {
            alert('Failed to cancel booking');
        }
    };

    const handlePayment = async (booking) => {
        try {
            await api.post('/payments/pay', {
                bookingId: booking.id,
                amount: booking.amount,
                paymentMethod: 'CREDIT_CARD'
            });
            alert('Payment successfully processed!');
            setBookings(bookings.map(b => b.id === booking.id ? { ...b, paid: true } : b));
        } catch (err) {
            alert('Payment failed: ' + (err.response?.data?.message || 'Error'));
        }
    };

    return (
        <div>
            <ProfileHeader title="My Bookings" />
            {bookings.length === 0 ? (
                <p className="text-muted fs-5">You haven't booked any services yet.</p>
            ) : (
                <div className="table-responsive bg-white rounded-4 shadow-sm p-4">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Service</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="fw-bold text-dark">{booking.serviceName}</td>
                                    <td>{booking.serviceDate}</td>
                                    <td>
                                        <span className={`badge rounded-pill ${booking.status === 'PENDING' ? 'bg-warning text-dark' : booking.status === 'COMPLETED' ? 'bg-success' : booking.status === 'CANCELLED' ? 'bg-danger' : 'bg-primary'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        {booking.status === 'PENDING' && (
                                            <button className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3" onClick={() => cancelBooking(booking.id)}>Cancel</button>
                                        )}
                                        {(booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') && !booking.paid && (
                                            <button className="btn btn-sm btn-success fw-bold rounded-pill px-3 ms-2" onClick={() => handlePayment(booking)}>Pay ${booking.amount}</button>
                                        )}
                                        {booking.paid && (
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success fw-bold p-2 ms-2 rounded-pill">PAID</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
