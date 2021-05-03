//Components
import "./App.scss";
import React, { useRef, useState } from "react";
import Header from "./components/header";
import { Canvas, useFrame, useResource } from "react-three-fiber";
import { Text, Box, RoundedBox } from "@react-three/drei";
import { Section } from "./components/section";

import { ThinFilmFresnelMap } from './ThinFilmFresnelMap'
import { mirrorsData } from './data'

const TEXT_PROPS = {
  fontSize: 1,
  font:
    "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
};

function Title() {
  return (
    <Text material-toneMapped={false} {...TEXT_PROPS}>
      TALON
    </Text>
  );
}

function Mirror({ sideMaterial, reflectionMaterial, args, ...props }) {
  const ref = useRef()

  useFrame(() => {
    ref.current.rotation.y += 0.001
    ref.current.rotation.z += 0.01
  })
  
  return (
    <Box {...props} 
      ref={ref} 
      args={args}
      material={[
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        reflectionMaterial,
        reflectionMaterial
      ]}
    />
  )
}



function Mirrors({ envMap, layers, ...props }) {
  const [thinFilmFresnelMap] = useState(new ThinFilmFresnelMap())
  const sideMaterial = useResource()
  const reflectionMaterial = useResource()

  return (
    <group name="mirrors" {...props}>
      <meshLambertMaterial ref={sideMaterial} map={thinFilmFresnelMap} color="#AAAAAA" />
      <meshLambertMaterial ref={reflectionMaterial} map={thinFilmFresnelMap} envMap={envMap} color="#FFFFFF" />
      {mirrorsData.mirrors.map((mirror, index) => (
        <Mirror
          key={`mirror-${index}`}
          layers={layers}
          {...mirror}
          name={`mirror-${index}`}
          sideMaterial={sideMaterial.current}
          reflectionMaterial={reflectionMaterial.current}
        />
      ))}
    </group>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
        <Section factor={1} offset={0}>
          <group position={[0, 0, 0]}>
            <Title />
            <Mirrors />
          </group>
        </Section>
        {/* <Block factor={1.2} offset={5.7}> */}
      </Canvas>
    </>
  );
}
