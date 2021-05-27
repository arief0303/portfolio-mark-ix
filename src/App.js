import React, { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useResource, useLoader } from "react-three-fiber";
import { a, useTransition } from "@react-spring/web";
import {
  Text,
  Box,
  Html,
  Sky,
  useGLTFLoader,
  useMatcapTexture,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import "./App.scss";

import img from "./0005.JPG";
import { ThinFilmFresnelMap } from "./components/ThinFilmFresnelMap";
import useRenderTarget from "./components/use-render-target";
import { mirrorsData } from "./components/data";
import { mirrorsData as diamondsData } from "./components/data";
import useLayers from "./components/use-layers";
import { Section } from "./components/section";
// import useSlerp from "./components/use-slerp";
import Header from "./components/header";
import state from "./components/state";

//Dev Tools
// import { useMatcapTexture, Octahedron } from "@react-three/drei";
// import { OrbitControls } from "@react-three/drei";

const TEXT_PROPS = {
  // fontSize: 1.25,
  fontSize: 1,
  font: "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
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
        name="title"
        depthTest={false}
        material-toneMapped={false}
        material-color="#FFFFFF"
        {...TEXT_PROPS}
      >
        Portfolio
      </Text>
    </group>
  );
}

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

function Diamond({ map, texture, matcap, layers, ...props }) {
  const ref = useLayers(layers);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <meshMatcapMaterial
        matcap={matcap}
        transparent
        opacity={0.9}
        color="#14CEFF"
      />
    </mesh>
  );
}

function Diamonds1({ layers, ...props }) {
  const [matcapTexture] = useMatcapTexture("2E763A_78A0B7_B3D1CF_14F209");
  const { nodes } = useGLTFLoader(process.env.PUBLIC_URL + "/diamond.glb");

  return (
    <group name="diamonds" {...props}>
      {diamondsData.mirrors.map((mirror, index) => (
        <Diamond
          key={`diamond-${index}`}
          name={`diamond-${index}`}
          {...mirror}
          geometry={nodes.Cylinder.geometry}
          matcap={matcapTexture}
          scale={[0.5, 0.5, 0.5]}
          layers={layers}
        />
      ))}
    </group>
  );
}

function Diamonds2({ layers, ...props }) {
  const [matcapTexture] = useMatcapTexture("D0CCCB_524D50_928891_727581");
  const { nodes } = useGLTFLoader(process.env.PUBLIC_URL + "/diamond.glb");

  return (
    <group name="diamonds" {...props}>
      {diamondsData.mirrors.map((mirror, index) => (
        <Diamond
          key={`diamond-${index}`}
          name={`diamond-${index}`}
          {...mirror}
          geometry={nodes.Cylinder.geometry}
          matcap={matcapTexture}
          scale={[0.5, 0.5, 0.5]}
          layers={layers}
        />
      ))}
    </group>
  );
}

function Diamonds3({ layers, ...props }) {
  const [matcapTexture] = useMatcapTexture("7877EE_D87FC5_75D9C7_1C78C0");
  const { nodes } = useGLTFLoader(process.env.PUBLIC_URL + "/diamond.glb");

  return (
    <group name="diamonds" {...props}>
      {diamondsData.mirrors.map((mirror, index) => (
        <Diamond
          key={`diamond-${index}`}
          name={`diamond-${index}`}
          {...mirror}
          geometry={nodes.Cylinder.geometry}
          matcap={matcapTexture}
          scale={[0.5, 0.5, 0.5]}
          layers={layers}
        />
      ))}
    </group>
  );
}

function Diamonds4({ layers, ...props }) {
  const [matcapTexture] = useMatcapTexture("8955D0_744CC4_EA4AEF_954DA4");
  const { nodes } = useGLTFLoader(process.env.PUBLIC_URL + "/diamond.glb");

  return (
    <group name="diamonds" {...props}>
      {diamondsData.mirrors.map((mirror, index) => (
        <Diamond
          key={`diamond-${index}`}
          name={`diamond-${index}`}
          {...mirror}
          geometry={nodes.Cylinder.geometry}
          matcap={matcapTexture}
          scale={[0.5, 0.5, 0.5]}
          layers={layers}
        />
      ))}
    </group>
  );
}

function Image() {
  const texture = useLoader(THREE.TextureLoader, img);
  return (
    <mesh>
      <planeBufferGeometry attach="geometry" args={[6.5 * 2, 4 * 2]} />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
}

function Content() {
  // const group = useSlerp();
  const group = useRef();
  const [cubeCamera, renderTarget] = useRenderTarget();
  const position = [0, 5, -11];

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene);
  });

  return (
    <>
      <Section factor={1.5} offset={0}>
        <group position={[0, 0, 0]} ref={group}>
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
            args={[0.1, 100, renderTarget]}
          />
          {/* <Text font={""} fontSize="0.4" position={[-2.15, 0.6, -6.5]}>
            Arief R. Syauqie's
          </Text>
          <Text font={""} fontSize="0.4" position={[1.5, 0.7, -6.5]}>
          _______________________
          </Text> */}
          <Title name="title" position={[0, 0, -6.5]} />
          <TitleCopies layers={[11]} />
          <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
          <ambientLight intensity={0.4} />
          {/* <OrbitControls /> */}
        </group>
      </Section>
      <Section factor={1} offset={1}>
        <group position={position}>
          <Diamonds1
            rotation={[1, 0, -180]}
            layers={[0, 11]}
            position={[0, -5.2, 7]}
          />
          <Text
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            FRONT-END
          </Text>
          <Text
            position={[0, -1, 0]}
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            DEVELOPER
          </Text>
          <Html
            center
            layers={[0]}
            position={[0, -7, 0]}
            style={{ width: "70vw" }}
          >
            <p className="text">
              Skills: HTML, Javascript, React.js, Vue.js, CSS, SASS, WebGL,
              Three.js
            </p>
            <p className="text">
              I am a front-end developer who is avid in computer graphics. From
              my previous semester in ICT & Media Design, I also have a
              background in UX design and 3D modelling & rendering with various
              tools such as Maya, Blender, Cinema4D.
            </p>
          </Html>
        </group>
      </Section>
      <Section factor={1} offset={2}>
        <group position={position}>
          <Diamonds2
            rotation={[1, 0, -90]}
            layers={[0, 11]}
            position={[0, -6, 7]}
          />
          <Text
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            Computer
          </Text>
          <Text
            position={[0, -1, 0]}
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            Vision
          </Text>
          <Text
            position={[0, -2, 0]}
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            &
          </Text>
          <Text
            position={[0, -3, 0]}
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            AI Developer
          </Text>
          <Html
            center
            layers={[0]}
            position={[0, -8, 0]}
            style={{ width: "70vw" }}
          >
            <p className="text">Skills: Python, Tensorflow, OpenCV</p>
            <p className="text">
              During my specialization in Artificial Intelligence, I specialize
              in Computer Vision technology and Deep Learning tools to develop
              AI models to gain information from image-based datasets.
            </p>
            {/* <p className="text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              euismod odio eu dui tempus consequat. Interdum et malesuada fames
              ac ante ipsum primis in faucibus. Ut venenatis nibh quis purus
              dignissim, ornare iaculis ipsum imperdiet. Duis lobortis fringilla
              est, eget ultrices sem faucibus a.
            </p> */}
          </Html>
        </group>
      </Section>
      <Section factor={1} offset={3}>
        <group position={position}>
          <Diamonds3
            rotation={[1, 0, -70]}
            layers={[0, 11]}
            position={[0, -6.7, 7]}
          />
          <Text
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            curriculum
          </Text>
          <Text
            position={[0, -1, 0]}
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            vitae
          </Text>
          <Html
            center
            layers={[0]}
            position={[0, -6.3, 0]}
            style={{ width: "70vw" }}
          >
            <p className="text">
              Education:
              <br />
              <br />
              <li>Graduated ICT Propadeutic Phase.</li>
              <li>4th semester of ICT Bachelor's degree.</li>
            </p>
            <br />
            <p className="text">
              Working Experiences: <br />
              <br />
              <li>
                {" "}
                Freelance Visual Jockey
                <br />
                August 2017 - August 2018
              </li>
              <li>
                {" "}
                Freelance Courier
                <br />
                December 2019 - present
              </li>
              <li>
                {" "}
                Junior Front-end Developer at PT. Teknologi Kartu Indonesia
                <br />
                December 2020 - March 2021
              </li>
            </p>
          </Html>
        </group>
      </Section>
      <Section factor={1} offset={4}>
        <group position={position}>
          <Diamonds4
            rotation={[1, 0, -40]}
            layers={[0, 11]}
            position={[0, -6.7, 7]}
          />
          <Text
            position={[0, -5.2, 0]}
            depthTest={false}
            material-toneMapped={false}
            material-color="#FFFFFF"
            {...TEXT_PROPS}
          >
            About Me
          </Text>
          <Image />
          <Html
            center
            layers={[0]}
            position={[0, -8.6, 0]}
            style={{ width: "70vw" }}
          >
            <p className="text">
              My name is Arief, and I'm a creative developer. I was born in
              Indonesia and I grew up loving arts and technology. I have a keen
              eye for visual art and a love of coding.
            </p>
          </Html>
        </group>
      </Section>
      {/* <Block factor={1.2} offset={5.7}> */}
    </>
  );
}

function Loader() {
  const { active, progress } = useProgress();
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress },
  });
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className="loading" style={{ opacity }}>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width: progress }}></a.div>
          </div>
        </a.div>
      )
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
        <Suspense fallback={null}>
          <Content />
        </Suspense>
      </Canvas>
      <Loader />
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
