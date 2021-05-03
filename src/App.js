//Components
import "./App.scss";
import * as THREE from "three";
import React, { useEffect, useState, useRef } from "react";
import Header from "./components/header";
import { Canvas, useFrame, useResource } from "react-three-fiber";
import { Text, Box } from "@react-three/drei";
import { OrbitControls, Sky } from "@react-three/drei";
// import { useMatcapTexture, Octahedron } from "@react-three/drei";
import { Section } from "./components/section";

import { ThinFilmFresnelMap } from "./ThinFilmFresnelMap";
import { mirrorsData } from "./data";

// import useSlerp from "./use-slerp";
import useLayers from "./use-layers";
// import useRenderTarget from "./use-render-target";

const TEXT_PROPS = {
  fontSize: 2.5,
  font:
    "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
};

// function Title() {
//   return (
//     <Text material-toneMapped={false} {...TEXT_PROPS}>
//       TALON
//     </Text>
//   );
// }

function Title({ layers, ...props }) {
  const group = useRef()
  useEffect(() => {
    group.current.lookAt(0, 0, 0)
  }, [])

  const textRef = useLayers(layers)

  return (
    <group {...props} ref={group}>
      <Text ref={textRef} name="text-talon" depthTest={false} material-toneMapped={false} material-color="#FFFFFF" {...TEXT_PROPS}>
        TALON
      </Text>
    </group>
  )
}

function Mirror({ sideMaterial, reflectionMaterial, args, layers, ...props }) {
  const ref = useLayers(layers);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.z += 0.01;
    }
  });

  return (
    <Box
      {...props}
      ref={ref}
      args={args}
      material={[
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        reflectionMaterial,
        reflectionMaterial,
      ]}
    />
  );
}

function Mirrors({ envMap, layers, ...props }) {
  const [thinFilmFresnelMap] = useState(new ThinFilmFresnelMap());
  const sideMaterial = useResource();
  const reflectionMaterial = useResource();

  return (
    <group name="mirrors" {...props}>
      <meshLambertMaterial
        ref={sideMaterial}
        map={thinFilmFresnelMap}
        color="#AAAAAA"
      />
      <meshLambertMaterial
        ref={reflectionMaterial}
        map={thinFilmFresnelMap}
        envMap={envMap}
        color="#FFFFFF"
      />
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
  );
}

// const Lights = () => {
//   return (
//     <>
//       {/* Ambient Light illuminates lights for all objects */}
//       <ambientLight intensity={0.3} />
//       {/* Diretion light */}
//       <directionalLight position={[10, 10, 5]} intensity={1} />
//       <directionalLight
//         castShadow
//         position={[0, 10, 0]}
//         intensity={1.5}
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         shadow-camera-far={50}
//         shadow-camera-left={-10}
//         shadow-camera-right={10}
//         shadow-camera-top={10}
//         shadow-camera-bottom={-10}
//       />
//       {/* Spotlight Large overhead light */}
//       <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
//     </>
//   );
// };

function Scene() {
  const [renderTarget] = useState(new THREE.WebGLCubeRenderTarget(1024));
  const cubeCamera = useRef();

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene);
  });

  return (
    <>
      <Section factor={1} offset={0}>
        <group position={[0, 0, 0]}>
          <Sky
            layers={[11]}
            sunPosition={[Math.PI, 0, Math.PI / 2]}
            turbidity={8}
            rayleigh={6}
            mieCoefficient={0.0005}
            mieDirectionalG={0.8}
          />
          <cubeCamera
            layers={[11]}
            name="cubeCamera"
            ref={cubeCamera}
            position={[0, 0, 0]}
            // i. notice how the renderTarget is passed as a constructor argument of the cubeCamera object
            args={[0.1, 100, renderTarget]}
          />
          <Title name="title" position={[0, 0, -10]} />
          {/* <Mirrors /> */}
          <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
          {/* <Lights /> */}
          <OrbitControls />
          <ambientLight intensity={0.4} />
        </group>
      </Section>
      {/* <Block factor={1.2} offset={5.7}> */}
    </>
  );
}

export default function App() {
  return (
    <>
      <Header />
      {/* <Canvas camera={{ position: [0, 0, 5], fov: 70 }}> */}
      <Canvas concurrent shadowMap camera={{ position: [0, 0, 5], fov: 70 }}>
        <Scene />
      </Canvas>
    </>
  );
}
