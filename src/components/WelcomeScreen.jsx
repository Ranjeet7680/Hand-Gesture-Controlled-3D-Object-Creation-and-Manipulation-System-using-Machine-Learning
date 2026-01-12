import React from 'react';

export const WelcomeScreen = ({ onStart }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            color: 'white',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                Hand Gesture 3D Studio
            </h1>

            <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem', lineHeight: '1.6' }}>
                Create and manipulate 3D objects using the power of your hands.
                <br />
                <span style={{ opacity: 0.8, fontSize: '1rem' }}>Featuring MediaPipe & Three.js</span>
            </p>

            <button
                onClick={onStart}
                style={{
                    padding: '15px 40px',
                    fontSize: '1.5rem',
                    background: '#4facfe',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    fontWeight: 'bold'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.6)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.4)';
                }}
            >
                Start Experience
            </button>

            <div style={{ marginTop: '4rem', opacity: 0.7 }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Developed by</p>
                <h3 style={{ margin: '5px 0', fontSize: '1.4rem', color: '#a0cfff' }}>Ranjeet Kumar</h3>
            </div>
        </div>
    );
};
