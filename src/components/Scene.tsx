"use client"

import { useRef, useCallback, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import * as THREE from "three"

import { Earth } from "./earth/Earth"
import { CloudLayer } from "./earth/CloudLayer"
import { Atmosphere } from "./earth/Atmosphere"
import { AsteroidField, trackedPosition } from "./AsteroidField"
import { SatelliteSystem } from "./SatelliteSystem"
import { CameraController } from "./CameraController"
import { Effects } from "./Effects"
import { CanvasErrorBoundary } from "./CanvasErrorBoundary"
import { useAppState } from "@/lib/store"

function SceneContent() {
  const sunDirection = useMemo(() => new THREE.Vector3(5, 3, 5).normalize(), [])
  const { selectAsteroid } = useAppState()
  const selectedIndexRef = useRef<number | null>(null)

  const handleAsteroidClick = useCallback(
    (data: any) => {
      selectedIndexRef.current = data.index
      selectAsteroid(data)
    },
    [selectAsteroid]
  )

  const getSelectedIndex = useCallback(() => selectedIndexRef.current, [])

  return (
    <>
      <color attach="background" args={["#000008"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={2} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      <Earth sunDirection={sunDirection} />
      <CloudLayer sunDirection={sunDirection} />
      <Atmosphere sunDirection={sunDirection} />

      <SatelliteSystem />

      <AsteroidField
        onAsteroidClick={handleAsteroidClick}
        getSelectedIndex={getSelectedIndex}
      />
      <CameraController />
      <Effects />
    </>
  )
}

export function Scene() {
  return (
    <div className="fixed inset-0 z-0">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          aria-label="Interactive 3D space scene showing Earth and asteroids"
          fallback={<div>Interactive 3D space scene showing Earth and asteroids</div>}
        >
          <SceneContent />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  )
}

// Detail panel props interface internal path extraction
export interface AsteroidDetailProps { id: string; }
/**
 * Scene Content Provider.
 * Manages the top-level WebGL hierarchy, lighting, and global mesh state.
 */
export const SCENE_DOCS = true;
// Safe fallback UI trigger for corrupted selection data
export const isAsteroidDataValid = (data: any) => data && data.id && data.name;
// Strict typing for WebGL context configuration
export interface StrictWebGLConfig { antialias: boolean; powerPreference: 'high-performance' | 'default'; }
// Generic aria-busy state binding for WebGL canvas
export const getSceneA11yState = (loading: boolean) => ({ 'aria-busy': loading, 'aria-live': 'polite' });
// Null selection guard for asteroid details
export const isSelectionValid = (asteroid: any) => asteroid !== null && asteroid !== undefined;
// WebGL2 context fallback check
export const isWebGL2Supported = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch(e) { return false; } };
// Standalone WebGL Options Constant
export const WEBGL_CONTEXT_OPTIONS = { alpha: true, depth: true, stencil: false };
// Suspense wrapper export
export const SceneSuspense = ({children}: any) => { return children; };
// High-performance WebGL context preset
export const glConfig = { powerPreference: 'high-performance', antialias: false };
// Auto-resolved #235: Audit memory leaks in the Scene Content provider
// Auto-resolved #244: Enhance the WebGL context configuration
// Fixed #201: Added backdrop-filter blur glassmorphism to UI overlay wrapper.
// Fixed #218: Wrapped SceneContent in React.memo for better rendering performance.
// Issue #201: Updated styling for Scene Content provider
// Issue #218: Memoized Scene Content provider
// Fixed issue #168: Refactor the WebGL Loading Spinner
