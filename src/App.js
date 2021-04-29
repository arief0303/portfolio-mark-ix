import React from "react";
import "./App.scss";
//Components
import Header from "./components/header";
import { Text } from '@react-three/drei'
import { Canvas } from "@react-three/fiber";

function Title() {
   return <Text material-toneMapped={false} {...TEXT_PROPS}>TALON</Text>
}

const TEXT_PROPS = {
  fontSize: 1,
  font: 'https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff'
}

export default function App() {
  return (
    <>
      <Header />
      <Canvas>
        <Title />
      </Canvas>
    </>
  );
}
