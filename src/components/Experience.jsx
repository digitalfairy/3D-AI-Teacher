"use client"
import { CameraControls, Environment, Gltf } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Teacher } from "./Teacher";
import { degToRad } from "three/src/math/MathUtils";

export const Experience = () => {
    return (
        <>
            <Canvas 
            camera={{
                position: [0, 0, 0.0001],
            }}>
                <CameraControls />
                <Environment preset="sunset" />
                <ambientLight intensity={0.8} color="pink" />
                <Teacher 
                    teacher={"Elias"} 
                    position={[-0.95, -0.25, -3]} 
                    scale={2.8} 
                    rotation-y={degToRad(20)}
                />
                <Gltf src="/models/basic_classroom.glb" position={[0.2, -1.3, -2]} rotation-y={-1.5} />
            </Canvas>
        </>
    );
};

const  CameraManager = () => {
    return (
        <CameraControls
            minZoom={1}
            maxZoom={3}
            polarRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
            azimuthRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
            mouseButtons={{
                left: 1,  //ACTION.ROTATE
                wheel: 16, //ACTION.ZOOM
            }}
            touches={{
                one: 32, // ACTION_TOUCH_ROTATE
                two: 512,  // ACTION.TOUCH_ZOOM
            }}
        />
    );
};