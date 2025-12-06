import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, AlertTriangle, CheckCircle, History, Image as ImageIcon } from 'lucide-react';
import { analyzePoopImage } from '../services/gemini';
import { analysisStore } from '../services/analysisStore';

export default function PoopAnalysis() {
    const navigate = useNavigate();
    const [view, setView] = useState('new'); // 'new' | 'history'
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (view === 'history') {
            analysisStore.getAll().then(setHistory);
        }
    }, [view]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setSelectedImage(file); // Store file object for API
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setAnalyzing(true);
        setResult(null);

        try {
            const analysisResult = await analyzePoopImage(selectedImage);

            if (analysisResult.error) {
                alert(analysisResult.error);
                setAnalyzing(false);
                return;
            }

            setResult(analysisResult);
            // Auto-save to history
            await analysisStore.save(analysisResult, image);

        } catch (error) {
            console.error("Analysis Component Error:", error);
            alert(error.message); // Show specific error to user
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                        <ArrowLeft size={24} color="var(--text-main)" />
                    </button>
                    <h2 style={{ margin: 0 }}>Poop Analysis</h2>
                </div>
                {/* View Toggle */}
                <div style={{ background: '#F3F4F6', padding: '0.25rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
                    <button
                        onClick={() => setView('new')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'calc(var(--radius-md) - 2px)',
                            border: 'none',
                            background: view === 'new' ? 'white' : 'transparent',
                            color: view === 'new' ? 'var(--secondary)' : 'var(--text-muted)',
                            boxShadow: view === 'new' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}
                    >
                        New
                    </button>
                    <button
                        onClick={() => setView('history')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'calc(var(--radius-md) - 2px)',
                            border: 'none',
                            background: view === 'history' ? 'white' : 'transparent',
                            color: view === 'history' ? 'var(--secondary)' : 'var(--text-muted)',
                            boxShadow: view === 'history' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}
                    >
                        History
                    </button>
                </div>
            </div>

            {!import.meta.env.VITE_GEMINI_API_KEY && (
                <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#C2410C' }}>
                    <strong>Demo Mode:</strong> Add <code>VITE_GEMINI_API_KEY</code> to <code>.env</code> file to enable real AI analysis.
                </div>
            )}

            {view === 'new' ? (
                <>
                    <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem 1rem' }}>
                        {!image ? (
                            <>
                                <div style={{
                                    width: '80px', height: '80px',
                                    background: 'var(--background)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1.5rem auto',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)'
                                }}>
                                    <Upload size={32} />
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>Upload Photo</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    Take a clear photo of the diaper for AI analysis.
                                </p>
                                <label className="btn" style={{ cursor: 'pointer', display: 'inline-flex', width: 'auto' }}>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                    Select Image
                                </label>
                            </>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <img src={image} alt="Upload" style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', maxHeight: '300px' }} />
                                {analyzing && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'rgba(255,255,255,0.8)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Loader2 className="spin" size={48} color="var(--primary)" />
                                        <p style={{ marginTop: '1rem', fontWeight: '600', color: 'var(--primary)' }}>Analyzing...</p>
                                    </div>
                                )}
                                {!analyzing && !result && (
                                    <button onClick={handleAnalyze} className="btn" style={{ marginTop: '1rem', width: '100%' }}>
                                        Run Analysis
                                    </button>
                                )}
                                {!analyzing && result && (
                                    <button
                                        onClick={() => { setImage(null); setResult(null); setSelectedImage(null); }}
                                        style={{
                                            marginTop: '1rem', display: 'block', margin: '1rem auto 0 auto',
                                            color: 'var(--text-muted)', textDecoration: 'underline'
                                        }}
                                    >
                                        Analyze new photo
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {result && <ResultCard result={result} />}
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                            <History size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No analysis history yet.</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ width: '100px', height: '100px', background: '#f0f0f0', flexShrink: 0 }}>
                                        <img src={item.image} alt="Analysis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '1rem', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {item.result?.isAlarming ? (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '600', background: '#FEF2F2', padding: '0.125rem 0.5rem', borderRadius: '999px' }}>Attention</span>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', background: '#F0FDF4', padding: '0.125rem 0.5rem', borderRadius: '999px' }}>Healthy</span>
                                            )}
                                        </div>
                                        {item.result && (
                                            <>
                                                <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.result.color}, {item.result.consistency}</p>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.result.recommendation}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', background: '#FAFAFA' }}>
                                    <p style={{ fontSize: '0.875rem' }}>{item.result?.analysis || 'No analysis details available.'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

function ResultCard({ result }) {
    return (
        <div className="card" style={{
            border: `2px solid ${result.isAlarming ? 'var(--danger)' : 'var(--success)'}`,
            background: result.isAlarming ? '#FEF2F2' : '#F0FDF4'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {result.isAlarming ? (
                    <AlertTriangle size={24} color="var(--danger)" />
                ) : (
                    <CheckCircle size={24} color="var(--success)" />
                )}
                <h3 style={{ color: result.isAlarming ? 'var(--danger)' : 'var(--success)', margin: 0 }}>
                    {result.isAlarming ? 'Attention Needed' : 'Healthy Result'}
                </h3>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Color & Consistency</p>
                <p>{result.color} • {result.consistency}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Analysis</p>
                <p style={{ lineHeight: '1.5' }}>{result.analysis}</p>
            </div>

            <div>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Recommendation</p>
                <p style={{ fontWeight: '500', color: result.isAlarming ? 'var(--danger)' : 'var(--text-main)' }}>{result.recommendation}</p>
            </div>

            {result.isAlarming && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>Note: This is an AI analysis and not a substitute for professional medical advice. Please consult your pediatrician.</p>
                </div>
            )}
        </div>
    );
}
