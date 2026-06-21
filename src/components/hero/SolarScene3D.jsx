import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef } from "react";

function SunCore() {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.35;
    });
    return (
        <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh ref={ref}>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial color="#D4A017" emissive="#B8890F" emissiveIntensity={0.8} metalness={0.4} roughness={0.2} />
            </mesh>
        </Float>
    );
}

function SolarPanel() {
    const ref = useRef();
    useFrame(() => {
        if (ref.current) ref.current.rotation.z = Math.sin(Date.now() * 0.0008) * 0.08 - 0.35;
    });
    return (
        <mesh ref={ref} position={[2.2, -0.8, -0.5]} rotation={[-0.35, 0.4, 0]}>
            <boxGeometry args={[2.4, 0.08, 1.4]} />
            <meshStandardMaterial color="#1a3a5c" metalness={0.6} roughness={0.3} />
        </mesh>
    );
}

export default function SolarScene3D() {
    return (
        <div className="absolute inset-0 pointer-events-none opacity-70" aria-hidden="true">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.35} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff5d6" />
                <pointLight position={[-3, 2, 2]} intensity={0.6} color="#D4A017" />
                <Stars radius={80} depth={40} count={1200} factor={3} fade speed={0.5} />
                <SunCore />
                <SolarPanel />
            </Canvas>
        </div>
    );
}
