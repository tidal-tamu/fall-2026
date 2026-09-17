import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {
    C,
    PIXEL_FONT,
    W,
    D,
    GLASS_H,
    MARQUEE_H,
    BASE_H,
    POST,
    OUTER_W,
    SCREEN_Y,
    TITLE_Y,
    SUB_Y,
    RAIL_Y,
    MetalMat,
    Trim,
} from "./clawMachineShared";

/* Backlit interior screen: soft vertical gradient + faint scanlines. */
function useScreenTexture() {
    return useMemo(() => {
        const c = document.createElement("canvas");
        c.width = c.height = 256;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = C.screen;
        ctx.fillRect(0, 0, 256, 256);
        // scanlines, lightened rather than darkened: the panel is already ink
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        for (let y = 0; y < 256; y += 3) ctx.fillRect(0, y, 256, 1);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }, []);
}

/* -------------------------------------------------------------------------- */
/*  "TIDALbyte '26" — one continuous lockup.                                  */
/*                                                                            */
/*  Press Start 2P is monospaced at 1em per glyph, so laying the three colour  */
/*  runs out left-anchored at exact character offsets keeps them kerned as a   */
/*  single word instead of three floating labels.                             */
/* -------------------------------------------------------------------------- */
function Wordmark({ size }: { size: number }) {
    const TIDAL = 5;
    const BYTE = 4;
    const GAP = 0.6;
    const YEAR = 3;
    const start = -((TIDAL + BYTE + GAP + YEAR) / 2) * size;

    return (
        <group>
            <Text
                font={PIXEL_FONT}
                position={[start, 0, 0]}
                fontSize={size}
                color={C.screenInk}
                anchorX="left"
                anchorY="middle"
            >
                TIDAL
            </Text>
            <Text
                font={PIXEL_FONT}
                position={[start + TIDAL * size, 0, 0]}
                fontSize={size}
                color={C.dim}
                anchorX="left"
                anchorY="middle"
            >
                byte
            </Text>
            <Text
                font={PIXEL_FONT}
                position={[start + (TIDAL + BYTE + GAP) * size, 0, 0]}
                fontSize={size}
                color={C.dim}
                anchorX="left"
                anchorY="middle"
            >
                '26
            </Text>
        </group>
    );
}

/* -------------------------------------------------------------------------- */
/*  Cabinet: interior shell, backlit screen, frame, glass, marquee, base      */
/* -------------------------------------------------------------------------- */
const ClawCabinet = ({ showControls }: { showControls: boolean }) => {
    const screenTex = useScreenTexture();

    const posts: [number, number][] = [
        [W / 2, D / 2],
        [-W / 2, D / 2],
        [W / 2, -D / 2],
        [-W / 2, -D / 2],
    ];

    return (
        <group>
            {/* ---------------- interior shell ---------------- */}
            <mesh position={[0, -0.02, 0]} receiveShadow>
                <boxGeometry args={[W, 0.04, D]} />
                <meshStandardMaterial
                    color={C.floor}
                    roughness={0.75}
                    metalness={0.1}
                />
            </mesh>
            <mesh position={[0, GLASS_H / 2, -D / 2]} receiveShadow>
                <planeGeometry args={[W, GLASS_H]} />
                <meshStandardMaterial
                    color={C.interior}
                    roughness={0.8}
                    metalness={0.05}
                />
            </mesh>
            <mesh
                position={[-W / 2, GLASS_H / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
                receiveShadow
            >
                <planeGeometry args={[D, GLASS_H]} />
                <meshStandardMaterial
                    color={C.interiorSide}
                    roughness={0.85}
                    metalness={0.05}
                />
            </mesh>
            <mesh
                position={[W / 2, GLASS_H / 2, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                receiveShadow
            >
                <planeGeometry args={[D, GLASS_H]} />
                <meshStandardMaterial
                    color={C.interiorSide}
                    roughness={0.85}
                    metalness={0.05}
                />
            </mesh>
            <mesh
                position={[0, GLASS_H, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[W, D]} />
                <meshStandardMaterial
                    color={C.frameEdge}
                    roughness={0.95}
                    metalness={0}
                />
            </mesh>

            {/* ---------------- backlit screen ---------------- */}
            <group position={[0, SCREEN_Y, -D / 2 + 0.04]}>
                <mesh position={[0, 0, -0.015]}>
                    <planeGeometry args={[W - 0.85, 1.16]} />
                    <meshStandardMaterial
                        color={C.frame}
                        roughness={0.7}
                        metalness={0.2}
                    />
                </mesh>
                <mesh>
                    <planeGeometry args={[W - 1.0, 1.0]} />
                    <meshStandardMaterial
                        map={screenTex}
                        // Fully diffuse, and bright enough on its own that the
                        // panel stays solid ink rather than picking up grey.
                        emissiveMap={screenTex}
                        emissive="#ffffff"
                        emissiveIntensity={0.55}
                        roughness={1}
                        metalness={0}
                    />
                </mesh>
                <Trim
                    color={C.chrome}
                    position={[0, 0.51, 0.01]}
                    scale={[W - 1.0, 0.02, 0.01]}
                />
                <Trim
                    color={C.chrome}
                    position={[0, -0.51, 0.01]}
                    scale={[W - 1.0, 0.02, 0.01]}
                />
            </group>

            {/* ---------------- text on the screen ---------------- */}
            <group position={[0, 0, -D / 2 + 0.09]}>
                <group position={[0, TITLE_Y, 0]}>
                    <Wordmark size={0.26} />
                </group>
                <Text
                    font={PIXEL_FONT}
                    position={[0, SUB_Y, 0]}
                    fontSize={0.085}
                    // sits on the ink panel, so it has to be light
                    color={C.dim}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.06}
                >
                    MSC BETHANCOURT · 12 HOURS · FALL 2026
                </Text>
            </group>

            {/* ---------------- gantry rail ---------------- */}
            <mesh position={[0, RAIL_Y, 0]} castShadow>
                <boxGeometry args={[W - 0.3, 0.09, 0.09]} />
                <MetalMat />
            </mesh>

            {/* ---------------- posts & rails ---------------- */}
            {posts.map(([x, z], i) => (
                <mesh key={i} position={[x, GLASS_H / 2, z]} castShadow>
                    <boxGeometry args={[POST, GLASS_H, POST]} />
                    <MetalMat />
                </mesh>
            ))}
            {[0, GLASS_H].map((y, i) => (
                <group key={i} position={[0, y, 0]}>
                    <mesh position={[0, 0, D / 2]} castShadow>
                        <boxGeometry args={[W + POST, POST, POST]} />
                        <MetalMat />
                    </mesh>
                    <mesh position={[0, 0, -D / 2]}>
                        <boxGeometry args={[W + POST, POST, POST]} />
                        <MetalMat />
                    </mesh>
                    <mesh position={[W / 2, 0, 0]} castShadow>
                        <boxGeometry args={[POST, POST, D]} />
                        <MetalMat />
                    </mesh>
                    <mesh position={[-W / 2, 0, 0]} castShadow>
                        <boxGeometry args={[POST, POST, D]} />
                        <MetalMat />
                    </mesh>
                </group>
            ))}

            {/* ---------------- front glass ---------------- */}
            {/* Plain transparent glass rather than `transmission`: transmission
                only refracts opaque geometry, which would cull the text and the
                balls we are meant to be looking at through it. depthWrite off
                keeps the interior sorting correctly behind it. */}
            <mesh position={[0, GLASS_H / 2, D / 2]} renderOrder={10}>
                <planeGeometry args={[W, GLASS_H]} />
                <meshPhysicalMaterial
                    color={C.glass}
                    transparent
                    opacity={0.07}
                    roughness={0.08}
                    metalness={0}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* ---------------- marquee ---------------- */}
            <group position={[0, GLASS_H + MARQUEE_H / 2, 0]}>
                <mesh castShadow>
                    <boxGeometry args={[OUTER_W, MARQUEE_H, D * 0.8]} />
                    <meshStandardMaterial
                        color={C.frame}
                        roughness={0.6}
                        metalness={0.3}
                    />
                </mesh>
                <mesh position={[0, 0, (D * 0.8) / 2 + 0.01]}>
                    <planeGeometry args={[OUTER_W - 0.12, MARQUEE_H - 0.14]} />
                    <meshStandardMaterial
                        color={C.ink}
                        roughness={0.6}
                    />
                </mesh>
                <Text
                    font={PIXEL_FONT}
                    position={[0, 0, (D * 0.8) / 2 + 0.04]}
                    fontSize={0.19}
                    color={C.screenInk}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.12}
                >
                    ★ PRIZE CLAW ★
                </Text>
            </group>

            {/* ---------------- base ---------------- */}
            <mesh position={[0, -BASE_H / 2, 0]} castShadow>
                <boxGeometry args={[OUTER_W, BASE_H, D + POST]} />
                <meshStandardMaterial
                    color={C.frame}
                    roughness={0.6}
                    metalness={0.3}
                />
            </mesh>
            <Trim
                color={C.chrome}
                position={[0, -0.06, (D + POST) / 2 + 0.01]}
                scale={[OUTER_W, 0.035, 0.02]}
            />

            {/* Control panel. Portrait only: there the whole cabinet is in view
                and this fills what would otherwise be a dead slab. On landscape
                the base is mostly below the fold and the panel would collide
                with the HTML register button sitting over it. */}
            <group
                position={[0, 0, (D + POST) / 2 + 0.02]}
                visible={showControls}
            >
                <mesh position={[0, -0.52, 0]}>
                    <planeGeometry args={[OUTER_W - 1.4, 0.46]} />
                    <meshStandardMaterial color={C.paper} roughness={0.85} />
                </mesh>
                <Text
                    font={PIXEL_FONT}
                    position={[0, -0.52, 0.03]}
                    fontSize={0.15}
                    color={C.ink}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.1}
                >
                    INSERT COIN
                </Text>
                <group position={[-2.0, -1.05, 0]}>
                    <mesh rotation={[0.45, 0, 0]}>
                        <cylinderGeometry args={[0.03, 0.04, 0.26, 12]} />
                        <MetalMat color={C.chrome} />
                    </mesh>
                    <mesh position={[0, 0.14, 0.06]}>
                        <sphereGeometry args={[0.07, 16, 16]} />
                        <meshStandardMaterial color={C.chrome} roughness={0.4} />
                    </mesh>
                </group>
                {[
                    { x: 1.7, c: C.chrome },
                    { x: 2.1, c: C.chromeDark },
                ].map(({ x, c }) => (
                    <mesh
                        key={x}
                        position={[x, -1.05, 0.02]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
                        <meshStandardMaterial color={c} roughness={0.35} />
                    </mesh>
                ))}
                <mesh position={[0, -1.45, 0]}>
                    <planeGeometry args={[1.6, 0.5]} />
                    <meshStandardMaterial color={C.ink} roughness={0.9} />
                </mesh>
            </group>
        </group>
    );
};

export default ClawCabinet;
