import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ClawCabinet from "./ClawCabinet";
import BallPit from "./BallPit";
import {
    C,
    BALL_COLORS,
    D,
    OUTER_W,
    VISIBLE_H,
    VISIBLE_MID,
    FULL_MID,
    W,
    FILL_H,
    PIT_CEILING,
    RAIL_Y,
    CLAW_Y,
    CLAW_X,
    CLAW_SCALE,
    MetalMat,
} from "./clawMachineShared";

/* -------------------------------------------------------------------------- */
/*  The claw. The cabinet is static, so this is the only scripted motion.      */
/* -------------------------------------------------------------------------- */
function Claw() {
    const group = useRef<THREE.Group>(null!);
    const prongs = useRef<THREE.Group[]>([]);
    const cable = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const y = CLAW_Y + Math.sin(t * 0.5) * 0.08;
        group.current.position.y = y;

        // attach at the top of the (scaled) pivot cap, not the raw hub radius
        const top = y + 0.2 * CLAW_SCALE;
        const len = Math.max(0.05, RAIL_Y - top);
        cable.current.position.y = top + len / 2;
        cable.current.scale.y = len;

        const open = (Math.sin(t * 0.5 - 1.0) * 0.5 + 0.5) * 0.32 + 0.2;
        prongs.current.forEach((p) => {
            if (p) p.rotation.z = open;
        });
    });

    return (
        <group position={[CLAW_X, 0, 0]}>
            <mesh ref={cable}>
                <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
                <meshStandardMaterial
                    color={C.chrome}
                    metalness={0.7}
                    roughness={0.45}
                />
            </mesh>

            <group ref={group} scale={CLAW_SCALE}>
                <mesh castShadow>
                    <sphereGeometry args={[0.17, 24, 24]} />
                    <MetalMat color={C.chrome} />
                </mesh>
                <mesh position={[0, 0.14, 0]}>
                    <cylinderGeometry args={[0.07, 0.1, 0.12, 16]} />
                    <MetalMat />
                </mesh>

                {/* shoulder tilts each arm out, elbow curls the tip back in */}
                {[0, 1, 2].map((i) => (
                    <group key={i} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
                        <group
                            position={[0.1, -0.02, 0]}
                            ref={(el) => {
                                if (el) prongs.current[i] = el;
                            }}
                        >
                            <mesh position={[0, -0.19, 0]} castShadow>
                                <boxGeometry args={[0.06, 0.38, 0.06]} />
                                <MetalMat color={C.chrome} />
                            </mesh>
                            <mesh position={[0, -0.38, 0]}>
                                <sphereGeometry args={[0.048, 14, 14]} />
                                <MetalMat />
                            </mesh>
                            <group
                                position={[0, -0.38, 0]}
                                rotation={[0, 0, -1.15]}
                            >
                                <mesh position={[0, -0.11, 0]} castShadow>
                                    <boxGeometry args={[0.055, 0.24, 0.055]} />
                                    <MetalMat color={C.chrome} />
                                </mesh>
                                <mesh position={[0, -0.24, 0]}>
                                    <sphereGeometry args={[0.04, 12, 12]} />
                                    <meshStandardMaterial
                                        color={C.paper}
                                        roughness={0.4}
                                    />
                                </mesh>
                            </group>
                        </group>
                    </group>
                ))}
            </group>
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */
function Scene() {
    const viewport = useThree((s) => s.viewport);
    const portrait = viewport.width < viewport.height;

    // Sized on width: the cabinet front spans 75% of the screen. `viewport` is
    // measured at z = 0, so the group is pushed back by half its depth to land
    // the front glass exactly on that plane — otherwise perspective magnifies
    // the near faces and the cabinet reads noticeably wider than asked for.
    const { fit, offsetY, offsetZ } = useMemo(() => {
        const widthFrac = portrait ? 0.95 : 0.75;
        const byWidth = (viewport.width * widthFrac) / OUTER_W;
        const byHeight = (viewport.height * 0.88) / VISIBLE_H;
        const s = Math.min(byWidth, byHeight);

        // Landscape: lift the interior above centre and let the base run off
        // the bottom edge. Portrait: the cabinet is width-bound and short, so
        // centre the whole thing rather than leaving the base stranded.
        const offsetY = portrait
            ? -FULL_MID * s
            : viewport.height * 0.06 - VISIBLE_MID * s;

        return { fit: s, offsetY, offsetZ: -(D / 2) * s };
    }, [viewport.width, viewport.height, portrait]);

    return (
        <>
            {/* Bright, neutral, entirely colourless. On a white page the scene
                should read as a studio product shot, so the ambient does most
                of the work and the directionals only carve enough shading to
                keep the balls spherical. No environment map: with metalness
                this low nothing needs one, and it drops a runtime HDR fetch. */}
            <ambientLight intensity={1.55} />
            <directionalLight
                position={[4, 7, 6]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-6, 3, 5]} intensity={0.55} />
            <directionalLight position={[0, -2, 6]} intensity={0.3} />

            {/* Static: no rotation, no parallax. Straight-on so you are looking
                through the front glass into the cabinet. */}
            <group position={[0, offsetY, offsetZ]} scale={fit}>
                <ClawCabinet showControls={portrait} />
                <Claw />
                <BallPit
                    width={W}
                    depth={D}
                    ceiling={PIT_CEILING}
                    fillHeight={FILL_H}
                    colors={BALL_COLORS}
                    count={95}
                    minR={0.24}
                    maxR={0.42}
                />
            </group>
        </>
    );
}

const ClawMachine = () => {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            className="!absolute inset-0"
        >
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
        </Canvas>
    );
};

export default ClawMachine;
