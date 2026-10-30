import React, { useRef } from 'react'
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import { Shape } from 'three';

import state from '../store';

const CustomGarment = ({ type, snap, logoTexture, fullTexture }) => {
  const material = useRef();

  useFrame((_, delta) => easing.dampC(material.current.color, snap.color, 0.25, delta));

  const garmentShape = new Shape();
  garmentShape.moveTo(-0.55, 1.02);
  garmentShape.lineTo(-0.88, 0.82);
  garmentShape.lineTo(-1.02, 0.3);
  garmentShape.lineTo(-0.78, 0.16);
  garmentShape.lineTo(-0.62, 0.48);
  garmentShape.lineTo(-0.62, -1.05);
  garmentShape.lineTo(0.62, -1.05);
  garmentShape.lineTo(0.62, 0.48);
  garmentShape.lineTo(0.78, 0.16);
  garmentShape.lineTo(1.02, 0.3);
  garmentShape.lineTo(0.88, 0.82);
  garmentShape.lineTo(0.55, 1.02);
  garmentShape.quadraticCurveTo(0, 0.78, -0.55, 1.02);
  garmentShape.closePath();

  return (
    <group>
      <mesh castShadow position={[0, 0, -0.18]}>
        <extrudeGeometry args={[garmentShape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.035, bevelSegments: 3 }]} />
        <meshStandardMaterial ref={material} color={snap.color} roughness={1} />
      </mesh>

      {snap.isFullTexture && (
        <mesh position={[0, 0, 0.205]}>
          <planeGeometry args={[1.05, 1.3]} />
          <meshBasicMaterial map={fullTexture} transparent toneMapped={false} />
        </mesh>
      )}
      {snap.isLogoTexture && (
        <mesh position={[0, 0.02, 0.225]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial map={logoTexture} transparent toneMapped={false} />
        </mesh>
      )}

      {type === 'Hoodie' ? (
        <>
          <mesh position={[0, 0.85, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.13, 16, 32, Math.PI]} />
            <meshStandardMaterial color={snap.color} roughness={1} />
          </mesh>
          <mesh position={[0, -0.25, 0.23]}>
            <boxGeometry args={[0.65, 0.28, 0.03]} />
            <meshStandardMaterial color={snap.color} roughness={1} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 0, 0.23]}>
            <boxGeometry args={[0.035, 1.65, 0.04]} />
            <meshStandardMaterial color="#d7d0c5" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.82, 0.02]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.35, 0.08, 0.48]} />
            <meshStandardMaterial color={snap.color} roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
};

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta));

  const stateString = JSON.stringify(snap);

  if (snap.selectedProduct.type === 'Hoodie' || snap.selectedProduct.type === 'Jacket') {
    return <CustomGarment type={snap.selectedProduct.type} snap={snap} logoTexture={logoTexture} fullTexture={fullTexture} />;
  }

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt