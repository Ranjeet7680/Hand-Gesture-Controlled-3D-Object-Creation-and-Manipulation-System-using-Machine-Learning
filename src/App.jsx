import React, { useState } from 'react';
import { GameProvider } from './store/GameContext';
import { Scene } from './components/Scene';
import { HandController } from './components/HandController';
import { UIOverlay } from './components/UIOverlay';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
    const [started, setStarted] = useState(false);

    return (
        <GameProvider>
            <div className="app-container">
                {!started ? (
                    <WelcomeScreen onStart={() => setStarted(true)} />
                ) : (
                    <>
                        <Scene />
                        <HandController />
                        <UIOverlay />
                    </>
                )}
            </div>
        </GameProvider>
    )
}

export default App
