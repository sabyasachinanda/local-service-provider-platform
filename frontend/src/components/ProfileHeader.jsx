import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProfileHeader = ({ title }) => {
    const { user, updateProfileImage } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await api.post('/upload/profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                updateProfileImage(response.data.data);
            }
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.message || 'Error'));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="d-flex align-items-center border-bottom pb-4 mb-4 mt-2">
            <div className="position-relative me-4" style={{width: '80px', height: '80px'}}>
                {user?.profileImageUrl ? (
                    <img src={`${(import.meta.env.VITE_API_URL || 'http://localhost:8082/api').replace('/api', '')}${user.profileImageUrl}`} alt="Profile" className="rounded-circle shadow-sm" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                    <div className="bg-primary text-white rounded-circle shadow-sm d-flex justify-content-center align-items-center display-5 fw-bold" style={{width: '100%', height: '100%'}}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                <button 
                    className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 shadow border"
                    style={{width: '30px', height: '30px', padding: 0}}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="Upload Profile Image"
                >
                    📷
                </button>
            </div>
            <div>
                <h2 className="text-primary fw-bold mb-1">{title}</h2>
                <p className="text-muted mb-0 fw-bold fs-5">{user?.name} | <span className="badge bg-secondary">{user?.role.replace('_', ' ')}</span></p>
                <input type="file" className="d-none" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            </div>
        </div>
    );
};

export default ProfileHeader;
