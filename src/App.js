import React from "react";
import "./App.scss";
//Components
import Header from "./components/header";
import { Text } from '@react-three/drei';
import { RoundedBox } from '@react-three/drei';
import { Canvas } from "@react-three/fiber";

const TEXT_PROPS = {
  fontSize: 1,
  font: 'https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff'
}

function Title() {
   return <Text material-toneMapped={false} {...TEXT_PROPS}>TALON</Text>
}

export default function App() {
  return (
    <>
      <Header />
      <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
        <Title />
        <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}>
          <meshPhongMaterial attach="material" color="#f3f3f3" wireframe />
        </RoundedBox>
      </Canvas>
    </>
  );
}
