"use client"
import { Box, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export const Experience = () => {
    return (
        <>
            <Canvas>
                <OrbitControls />
                <Box>
                    <meshNormalMaterial />
                </Box>
            </Canvas>
        </>
    );
};