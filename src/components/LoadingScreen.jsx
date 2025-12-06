export default function LoadingScreen() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            zIndex: 9999
        }}>
            <div className="logo-loader">
                <img src="/logo.png" alt="Loading..." style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </div>
            <style>{`
                .logo-loader {
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}
