import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Sky } from '@react-three/drei';
import { useGame } from '../store/GameContext';
import { Gestures } from '../logic/GestureRecognizer';

const Geometries = {
    box: (props) => <boxGeometry args={[1, 1, 1]} {...props} />,
    sphere: (props) => <sphereGeometry args={[0.6, 32, 32]} {...props} />,
    cylinder: (props) => <cylinderGeometry args={[0.5, 0.5, 1, 32]} {...props} />,
    cone: (props) => <coneGeometry args={[0.5, 1, 32]} {...props} />
};

const DynamicObject = ({ data }) => {
    const meshRef = useRef();
    const { selectedId } = useGame();
    const isSelected = selectedId === data.id;

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.set(...data.position);
            meshRef.current.rotation.set(...data.rotation);
            meshRef.current.scale.set(...data.scale);
            if (meshRef.current.material) {
                meshRef.current.material.color.set(data.color);
                meshRef.current.material.emissive.set(isSelected ? '#444444' : '#000000');

                // Material Updates
                const mat = meshRef.current.material;
                if (data.material === 'metal') {
                    mat.metalness = 0.9;
                    mat.roughness = 0.1;
                } else if (data.material === 'rubber') {
                    mat.metalness = 0.0;
                    mat.roughness = 0.9;
                } else {
                    // Plastic / Default
                    mat.metalness = 0.1;
                    mat.roughness = 0.3; // Shiny plastic
                }
            }
        }
    });

    const Geometry = Geometries[data.type] || Geometries.box;

    return (
        <mesh ref={meshRef}>
            <Geometry />
            <meshStandardMaterial />
        </mesh>
    );
};

const GameLoop = () => {
    const { handStateRef, selectedId, setSelectedId, setObjects, objects } = useGame();
    const lastSelectionTime = useRef(0);

    useFrame((state, delta) => {
        const { gesture, position } = handStateRef.current;
        const rotateSpeed = 3 * delta; // Faster rotation
        const scaleSpeed = 1.5 * delta; // Faster scaling

        // Selection Logic (Throttle to avoid flickering)
        if (gesture === Gestures.CLOSED_FIST && Date.now() - lastSelectionTime.current > 300) { // Faster selection
            const cursorX = position.x * 5;
            const cursorY = position.y * 5;

            let closestDist = Infinity;
            let closestId = null;

            objects.forEach(o => {
                const dx = o.position[0] - cursorX;
                const dy = o.position[1] - cursorY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 1.5 && dist < closestDist) {
                    closestDist = dist;
                    closestId = o.id;
                }
            });

            if (closestId) {
                setSelectedId(closestId);
                lastSelectionTime.current = Date.now();
            }
        }

        if (selectedId) {
            setObjects(prev => prev.map(obj => {
                if (obj.id !== selectedId) return obj;

                let newPos = [...obj.position];
                let newRot = [...obj.rotation];
                let newScale = [...obj.scale];

                if (gesture === Gestures.ONE_FINGER_UP) {
                    const targetX = position.x * 5;
                    const targetY = position.y * 5;
                    // Lerp - Increased factor for snappier movement (0.2 -> 0.4)
                    // Input is already smoothed in HandController, so we can follow closely.
                    newPos[0] += (targetX - newPos[0]) * 0.4;
                    newPos[1] += (targetY - newPos[1]) * 0.4;
                }

                if (gesture === Gestures.TWO_FINGERS_UP) {
                    newRot[1] += rotateSpeed;
                    newRot[0] += rotateSpeed * 0.5;
                }

                if (gesture === Gestures.THREE_FINGERS_UP) {
                    newScale[0] += scaleSpeed;
                    newScale[1] += scaleSpeed;
                    newScale[2] += scaleSpeed;
                }

                return { ...obj, position: newPos, rotation: newRot, scale: newScale };
            }));
        }
    });

    return null;
}

export const Scene = () => {
    const { objects } = useGame();

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#87CEEB' }}>
            <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                {/* Sky and Lighting */}
                <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} mieCoefficient={0.005} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, 10, -10]} intensity={0.5} />

                {/* Ground helper */}
                <Grid infiniteGrid sectionColor="#ffffff" cellColor="#aaaaaa" fadeDistance={30} sectionThickness={1} cellThickness={0.5} />

                <GameLoop />

                {objects.map(obj => (
                    <DynamicObject key={obj.id} data={obj} />
                ))}

                <OrbitControls makeDefault />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
