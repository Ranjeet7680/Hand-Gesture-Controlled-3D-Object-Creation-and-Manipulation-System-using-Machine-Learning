import React from 'react';
import { useGame } from '../store/GameContext';

export const UIOverlay = () => {
    const { handStateRef, objects, selectedId, debugMode, creationSettings, setCreationSettings } = useGame();
    // Force re-render periodically to show gesture if needed, or rely on other state changes.
    // Since handStateRef is mutable reference, it won't trigger re-render alone.
    // Only 'objects' or 'selectedId' changes trigger re-render.
    // We can use a ticker or just show static instructions.

    // For gesture display, we can use a local state synced with ref in a loop or useEffect
    const [gesture, setGesture] = React.useState('NONE');

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (handStateRef.current) {
                setGesture(handStateRef.current.gesture);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [handStateRef]);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '20px',
            color: 'white',
            fontFamily: 'monospace'
        }}>
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', maxWidth: '300px' }}>
                <h2 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #555', paddingBottom: '5px' }}>Controls</h2>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                    <li>✋ <b>Open Palm</b>: Create Object (Debounced)</li>
                    <li>✊ <b>Closed Fist</b>: Select Object (Not Impl)</li>
                    <li>☝️ <b>One Finger</b>: Move (X, Y)</li>
                    <li>✌️ <b>Two Fingers</b>: Rotate</li>
                    <li>🤟 <b>Three Fingers</b>: Scale</li>
                    <li>👍 <b>Thumb Up</b>: Change Color</li>
                </ul>
            </div>

            <div style={{ position: 'absolute', top: '20px', right: '20px', textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', textShadow: '0 2px 4px black' }}>
                    Gesture: <span style={{ color: '#4facfe' }}>{gesture}</span>
                </div>
                <div style={{ marginTop: '10px' }}>
                    Objects: {objects.length} | Selected: {selectedId || 'None'}
                </div>
            </div>

            {/* Creation Controls */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.8)',
                padding: '15px',
                borderRadius: '8px',
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <h3 style={{ margin: 0, borderBottom: '1px solid #555' }}>Create Options</h3>

                {/* Shape Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Shape</label>
                    <select
                        style={{ width: '100%', padding: '5px', background: '#333', color: 'white', border: 'none' }}
                        value={creationSettings.type}
                        onChange={(e) => setCreationSettings(prev => ({ ...prev, type: e.target.value }))}
                    >
                        <option value="box">Cube</option>
                        <option value="sphere">Sphere</option>
                        <option value="cylinder">Cylinder</option>
                        <option value="cone">Cone</option>
                        <option value="rectangle">Rectangle</option>
                    </select>
                </div>

                {/* Material Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Material</label>
                    <select
                        style={{ width: '100%', padding: '5px', background: '#333', color: 'white', border: 'none' }}
                        value={creationSettings.material}
                        onChange={(e) => setCreationSettings(prev => ({ ...prev, material: e.target.value }))}
                    >
                        <option value="plastic">Plastic</option>
                        <option value="metal">Metal</option>
                        <option value="rubber">Rubber</option>
                    </select>
                </div>

                {/* Color Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Color</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff', '#ff00ff'].map(c => (
                            <div
                                key={c}
                                onClick={() => setCreationSettings(prev => ({ ...prev, color: c }))}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    background: c,
                                    border: creationSettings.color === c ? '2px solid white' : '1px solid #555',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                        <input
                            type="color"
                            value={creationSettings.color}
                            onChange={(e) => setCreationSettings(prev => ({ ...prev, color: e.target.value }))}
                            style={{ width: '30px', height: '24px', padding: 0, border: 'none' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: 0.7 }}>
                <p>Ensure your hand is visible to the camera.</p>
            </div>
        </div>
    );
};
