"use client"

import { Suspense, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, OrbitControls } from "@react-three/drei"
import { Group, Mesh, Vector3 } from "three"

function RobotModel() {
  const root = useRef<Group>(null)
  const head = useRef<Group>(null)
  const eyeLeft = useRef<Mesh>(null)
  const eyeRight = useRef<Mesh>(null)
  const pointer = useMemo(() => new Vector3(), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const breathing = Math.sin(t * 1.4) * 0.03

    if (root.current) {
      root.current.position.y = breathing
      root.current.rotation.z = Math.sin(t * 0.6) * 0.03
    }

    pointer.set(state.pointer.x * 0.7, state.pointer.y * 0.4, 1.5)

    if (head.current) {
      head.current.lookAt(pointer)
      head.current.rotation.x *= 0.3
      head.current.rotation.y *= 0.5
    }

    const eyeScale = 1 + Math.max(0, state.pointer.x * 0.08)
    if (eyeLeft.current && eyeRight.current) {
      eyeLeft.current.scale.setScalar(eyeScale)
      eyeRight.current.scale.setScalar(eyeScale)
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.45}>
      <group ref={root}>
        <mesh position={[0, -1.6, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.1, 1.6, 32]} />
          <meshStandardMaterial color="#262a35" metalness={0.55} roughness={0.25} />
        </mesh>

        <mesh position={[0, -0.6, 0.78]}>
          <torusGeometry args={[0.45, 0.06, 20, 100]} />
          <meshStandardMaterial color="#4f9cff" emissive="#2b5ec4" emissiveIntensity={1.2} />
        </mesh>

        <group ref={head} position={[0, 0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.35, 0.95, 1.1]} />
            <meshStandardMaterial color="#191d26" metalness={0.5} roughness={0.18} />
          </mesh>

          <mesh ref={eyeLeft} position={[-0.28, 0.02, 0.56]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#8bc6ff" emissive="#5aa7ff" emissiveIntensity={2.2} />
          </mesh>
          <mesh ref={eyeRight} position={[0.28, 0.02, 0.56]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color="#8bc6ff" emissive="#5aa7ff" emissiveIntensity={2.2} />
          </mesh>
        </group>
      </group>
    </Float>
  )
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-sky-300" />
    </div>
  )
}

export function HeroRobotScene() {
  return (
    <div className="h-[64vh] w-full min-h-[480px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur">
      <Suspense fallback={<SceneFallback />}>
        <Canvas camera={{ position: [0, 0.4, 4.8], fov: 45 }} shadows dpr={[1, 1.5]}>
          <color attach="background" args={["#090b10"]} />
          <ambientLight intensity={0.35} />
          <spotLight
            intensity={2.2}
            position={[4, 7, 5]}
            angle={0.3}
            penumbra={0.6}
            castShadow
            color="#96bfff"
          />
          <pointLight intensity={1.5} position={[-4, 2, 2]} color="#647dff" />
          <RobotModel />
          <Environment preset="night" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.55} />
        </Canvas>
      </Suspense>
    </div>
  )
}
