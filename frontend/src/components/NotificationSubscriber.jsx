import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const NotificationSubscriber = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;

        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
        const wsUrl = apiBaseUrl.replace('/api', '/ws');
        const socket = new SockJS(wsUrl);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; // disable verbose debug logs

        stompClient.connect({}, (frame) => {
            console.log('Connected to WebSocket');
            stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
                if (message.body) {
                    const newNotification = {
                        id: Date.now(),
                        text: message.body
                    };
                    setNotifications(prev => [...prev, newNotification]);
                    
                    // Auto remove after 5 seconds
                    setTimeout(() => {
                        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
                    }, 5000);
                }
            });
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [user]);

    if (notifications.length === 0) return null;

    return (
        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999 }}>
            {notifications.map(n => (
                <div key={n.id} className="toast show align-items-center text-white bg-primary border-0 mb-2 shadow-lg rounded-3" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body fw-bold fs-6 py-3 px-4">
                            🔔 {n.text}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-3 m-auto" onClick={() => setNotifications(prev => prev.filter(nx => nx.id !== n.id))}></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationSubscriber;
