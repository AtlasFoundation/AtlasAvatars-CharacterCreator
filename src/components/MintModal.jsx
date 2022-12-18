import React, { useContext } from "react";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { Canvas } from "@react-three/fiber";
import { SceneContext } from "../context/SceneContext";

const canvasStyle = {
  right: '0',
  width: '390px',
  color: "#999999",
  height: "220px",
  background: "#40455A",
  border: "1px solid #303949",
  backdropFilter: "blur(22.5px)",
  borderRadius: '5px',
  marginTop:'10px'
}

export default function MintModal({model}) {
  if(!model) return null
  console.log('model', model)
    return (
        <Canvas
          style={canvasStyle}
          id="mint-scene"
            gl={{ antialias: true, preserveDrawingBuffer:true }}
            linear={false}
        >
          <ambientLight
              color={[1,1,1]}
              intensity={0.5}
            />
            
            <directionalLight 
              //castShadow = {true}
              intensity = {0.5} 
              //color = {[0.5,0.5,0.5]}
              position = {[3, 1, 5]} 
              shadow-mapSize = {[1024, 1024]}>
            </directionalLight>
          <OrbitControls
            minDistance={1.5}
            maxDistance={1.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2 - 0.1}
            enablePan={true}
            target={[0, 0.9, 0]}
          />
          <PerspectiveCamera>
          <mesh>
            <primitive object={model.scene.clone()} />
          </mesh>
          </PerspectiveCamera>
        </Canvas>
  );
}
