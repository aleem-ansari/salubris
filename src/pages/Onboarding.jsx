import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../services/userStore';
import { Baby } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        gender: 'boy',
        dob: '',
        weightKg: '',
        heightCm: '',
        feedTarget: '750'
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const calculateAgeMonths = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
        months -= birthDate.getMonth();
        months += today.getMonth();
        return months <= 0 ? 0 : months;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.dob) return;

        const ageMonths = calculateAgeMonths(formData.dob);

        userStore.save({
            ...formData,
            ageMonths, // Calculated age
            onboardedAt: new Date().toISOString()
        });

        navigate('/dashboard');
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        marginTop: '0.5rem',
        marginBottom: '1rem',
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        fontWeight: '500',
        color: 'var(--text-main)'
    };

    return (
        <div style={{ paddingTop: '2rem' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 1rem auto',
                    }}>
                        <img src="/logo.png" alt="Salubris Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1>Welcome to Salubris</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Let's get to know your little one</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={labelStyle}>Baby's Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Liam"
                            value={formData.name}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Gender</label>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
                            {['boy', 'girl'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, gender: g }))}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: `1px solid ${formData.gender === g ? 'var(--primary)' : 'var(--border)'}`,
                                        background: formData.gender === g ? 'var(--primary)' : 'transparent',
                                        color: formData.gender === g ? 'white' : 'var(--text-main)',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Weight (kg)</label>
                            <input
                                type="number"
                                name="weightKg"
                                placeholder="3.5"
                                step="0.1"
                                value={formData.weightKg}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Height (cm)</label>
                        <input
                            type="number"
                            name="heightCm"
                            placeholder="50"
                            step="0.1"
                            value={formData.heightCm}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Daily Feed Target (ml)</label>
                        <input
                            type="number"
                            name="feedTarget"
                            placeholder="750"
                            value={formData.feedTarget || ''} // Changed default to empty string for controlled input
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
                        Calculate Health & Continue
                    </button>
                </form>
            </div>
        </div>
    );
}
