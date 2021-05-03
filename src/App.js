import "./App.scss";
import * as THREE from "three";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Header from "./components/header";
import { Canvas, useFrame, useResource } from "react-three-fiber";
import { Text, Box } from "@react-three/drei";
import { Sky } from "@react-three/drei";

//Dev Tools
// import { OrbitControls } from "@react-three/drei";
// import { useMatcapTexture, Octahedron } from "@react-three/drei";

import { Section } from "./components/section";
import state from "./components/state";

import { ThinFilmFresnelMap } from "./components/ThinFilmFresnelMap";
import { mirrorsData } from "./components/data";

// import useSlerp from "./use-slerp";
import useLayers from "./components/use-layers";
// import useRenderTarget from "./use-render-target";

const TEXT_PROPS = {
  fontSize: 2.5,
  font:
    "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
};

function Title({ layers, ...props }) {
  const group = useRef();
  useEffect(() => {
    group.current.lookAt(0, 0, 0);
  }, []);

  const textRef = useLayers(layers);

  return (
    <group {...props} ref={group}>
      <Text
        ref={textRef}
        name="text-talon"
        depthTest={false}
        material-toneMapped={false}
        material-color="#FFFFFF"
        {...TEXT_PROPS}
      >
        ARV
      </Text>
    </group>
  );
}

// function ({ layers, ...props }) {
//   const group = useRef();
//   useEffect(() => {
//     group.current.lookAt(0, 0, 0);
//   }, []);

//   const textRef = useLayers(layers);

//   return (
//     <group {...props} ref={group}>

//     </group>
//   );
// }

function TitleCopies({ layers }) {
  const vertices = useMemo(() => {
    const y = new THREE.IcosahedronGeometry(8);
    return y.vertices;
  }, []);

  return (
    <group name="titleCopies">
      {vertices.map((vertex, i) => (
        <Title name={"titleCopy-" + i} position={vertex} layers={layers} />
      ))}
    </group>
  );
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
    <group name="mirrors" position={[0, 0, 0]} {...props}>
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

function Content() {
  const [renderTarget] = useState(new THREE.WebGLCubeRenderTarget(1024));
  const cubeCamera = useRef();

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene);
  });

  return (
    <>
      <Section factor={1.5} offset={0}>
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
          <TitleCopies layers={[11]} />

          <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
          <ambientLight intensity={0.4} />
          {/* <Lights /> */}
          {/* <OrbitControls /> */}
        </group>
      </Section>
      <Section factor={1.2} offset={1}>
        <group position={[-5, 0, -10]}>
          <Text
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            TALON
          </Text>
        </group>
      </Section>
      {/* <Block factor={1.2} offset={5.7}> */}
    </>
  );
}

export default function App() {
  const scrollArea = useRef();
  const domContent = useRef();
  const [events] = useState();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      <Header />
      <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
        {/* <Canvas concurrent shadowMap camera={{ position: [0, 0, 120], fov: 70 }}> */}
        <Content />
      </Canvas>
      <div
        className="scrollArea"
        ref={scrollArea}
        onScroll={onScroll}
        {...events}
      >
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  );
}
