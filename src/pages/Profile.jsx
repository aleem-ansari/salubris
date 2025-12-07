import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../services/userStore';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        gender: 'boy',
        dob: '',
        weightKg: '',
        heightCm: '',
        feedTarget: '750'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await userStore.get();
            if (user) {
                setFormData({
                    name: user.name || '',
                    gender: user.gender || 'boy',
                    dob: user.dob || '',
                    weightKg: user.weight_kg || user.weightKg || '',
                    heightCm: user.height_cm || user.heightCm || '',
                    feedTarget: user.feed_target_ml || user.feedTarget || '750'
                });
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setShowSuccess(false);

        try {
            const ageMonths = calculateAgeMonths(formData.dob);
            await userStore.save({
                ...formData,
                ageMonths
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
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

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <h2 style={{ margin: 0 }}>Edit Profile</h2>
            </div>

            <div className="card">
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
                            value={formData.feedTarget}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
                        {showSuccess ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Saved!</span> : (saving ? 'Saving...' : 'Save Changes')}
                    </button>
                </form>
            </div>
        </div>
    );
}
