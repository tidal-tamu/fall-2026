import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  A crammed pit of prize balls.                                             */
/*                                                                            */
/*  Rather than placing spheres on a grid (which reads as a tidy shop display, */
/*  not an arcade machine) the balls are dropped in and settled by a small     */
/*  sphere-collision solver. That produces the jammed, overlapping, pressed-   */
/*  against-the-glass pile a real claw machine has, and it means the cursor    */
/*  can shove them around and let them tumble back into a new arrangement.     */
/* -------------------------------------------------------------------------- */

interface BallPitProps {
    /** Interior extents of the cabinet, in local units. */
    width: number;
    depth: number;
    /** Hard ceiling so a shoved ball can't escape the glass. */
    ceiling: number;
    /** Roughly how high the settled pile should sit. */
    fillHeight: number;
    colors: string[];
    count?: number;
    minR?: number;
    maxR?: number;
}

type Ball = {
    p: THREE.Vector3;
    v: THREE.Vector3;
    q: THREE.Quaternion;
    r: number;
};

/* Tuning ------------------------------------------------------------------- */
const GRAVITY = 7.5;
const DAMPING = 0.93; // per step; high so the pile actually comes to rest
const WALL_BOUNCE = 0.28;
const PAIR_BOUNCE = 0.3;
const SUBSTEPS = 2;
const RELAX_ITERS = 2; // separation passes per substep
/* The cursor acts as a solid cylinder swept through the pit along the view
   axis, not as a soft force field. A force alone loses to the separation solver
   in a pile this jammed — balls barely budged. Displacing them out of the
   cylinder guarantees a real cavity that gravity then collapses again. */
const CURSOR_RADIUS = 0.55;
const CURSOR_KICK = 11; // outward velocity from the depenetration
const CURSOR_DRAG = 2.2; // how much of the cursor's own motion is imparted
const WARMUP_STEPS = 260; // settle the pile before the first frame is drawn

const UP = new THREE.Vector3(0, 1, 0);
const PLANE_NORMAL = new THREE.Vector3(0, 0, 1);

/* Soft dimple pattern, echoing the moulded texture on real prize balls. */
function useDimpleMap() {
    return useMemo(() => {
        const c = document.createElement("canvas");
        c.width = c.height = 256;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        const step = 16;
        for (let y = 0; y < 256; y += step) {
            for (let x = 0; x < 256; x += step) {
                const ox = (y / step) % 2 === 0 ? 0 : step / 2;
                ctx.beginPath();
                ctx.arc(x + ox, y, 2.1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(3, 2);
        return tex;
    }, []);
}

const BallPit = ({
    width,
    depth,
    ceiling,
    fillHeight,
    colors,
    count = 84,
    minR = 0.28,
    maxR = 0.48,
}: BallPitProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);
    const dimple = useDimpleMap();

    const camera = useThree((s) => s.camera);
    const domElement = useThree((s) => s.gl.domElement);

    /* Cursor position in this group's local space, or null when off-canvas. */
    const cursor = useRef<THREE.Vector2 | null>(null);
    const ndc = useRef(new THREE.Vector2());
    const pointerActive = useRef(false);

    useEffect(() => {
        // Listen on window, not the canvas. The throwable prize cards sit in an
        // overlay above the canvas and would otherwise swallow every
        // pointermove before it ever reached us, killing this interaction.
        // Coordinates are still resolved against the canvas' own rect.
        const onMove = (e: PointerEvent) => {
            const rect = domElement.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            ndc.current.set(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1,
            );
            pointerActive.current = true;
        };
        const onLeave = (e: PointerEvent) => {
            // relatedTarget null means the pointer actually left the window
            if (!e.relatedTarget) pointerActive.current = false;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerout", onLeave);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerout", onLeave);
        };
    }, [domElement]);

    /* ---------------------------------------------------------------------- */
    /*  Ball set, pre-settled                                                 */
    /* ---------------------------------------------------------------------- */
    const balls = useMemo<Ball[]>(() => {
        const list: Ball[] = [];
        for (let i = 0; i < count; i++) {
            const r = minR + Math.random() * (maxR - minR);
            list.push({
                r,
                // Scatter through a tall column so they interleave on the way
                // down instead of landing in neat layers.
                p: new THREE.Vector3(
                    (Math.random() - 0.5) * (width - 2 * r),
                    r + Math.random() * fillHeight * 2.4,
                    (Math.random() - 0.5) * (depth - 2 * r),
                ),
                v: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.4,
                    0,
                    (Math.random() - 0.5) * 0.4,
                ),
                q: new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                        Math.random() * Math.PI,
                    ),
                ),
            });
        }
        return list;
    }, [count, minR, maxR, width, depth, fillHeight]);

    /* ---------------------------------------------------------------------- */
    /*  One simulation step                                                   */
    /* ---------------------------------------------------------------------- */
    const step = useMemo(() => {
        const halfW = width / 2;
        const halfD = depth / 2;
        const n = balls.length;

        return (
            dt: number,
            cur: THREE.Vector2 | null,
            curVel: THREE.Vector2 | null,
        ) => {
            for (let i = 0; i < n; i++) {
                const b = balls[i];
                b.v.y -= GRAVITY * dt;
                b.p.addScaledVector(b.v, dt);
            }

            // pairwise separation
            for (let iter = 0; iter < RELAX_ITERS; iter++) {
                for (let i = 0; i < n; i++) {
                    const a = balls[i];
                    for (let j = i + 1; j < n; j++) {
                        const b = balls[j];
                        let dx = a.p.x - b.p.x;
                        let dy = a.p.y - b.p.y;
                        let dz = a.p.z - b.p.z;
                        const minD = a.r + b.r;
                        const d2 = dx * dx + dy * dy + dz * dz;
                        if (d2 >= minD * minD || d2 === 0) continue;

                        const d = Math.sqrt(d2);
                        const nx = dx / d;
                        const ny = dy / d;
                        const nz = dz / d;
                        const push = (minD - d) * 0.5;

                        a.p.x += nx * push;
                        a.p.y += ny * push;
                        a.p.z += nz * push;
                        b.p.x -= nx * push;
                        b.p.y -= ny * push;
                        b.p.z -= nz * push;

                        const rvn =
                            (a.v.x - b.v.x) * nx +
                            (a.v.y - b.v.y) * ny +
                            (a.v.z - b.v.z) * nz;
                        if (rvn < 0) {
                            const imp = rvn * (1 + PAIR_BOUNCE) * 0.5;
                            a.v.x -= nx * imp;
                            a.v.y -= ny * imp;
                            a.v.z -= nz * imp;
                            b.v.x += nx * imp;
                            b.v.y += ny * imp;
                            b.v.z += nz * imp;
                        }
                    }
                }
            }

            // Cursor obstacle, applied *after* separation so it stays
            // authoritative and the cavity actually holds open. Distance is
            // measured in the view plane only, so it behaves as a cylinder
            // punched through the full depth of the pit.
            if (cur) {
                for (let i = 0; i < n; i++) {
                    const b = balls[i];
                    const dx = b.p.x - cur.x;
                    const dy = b.p.y - cur.y;
                    const minD = CURSOR_RADIUS + b.r;
                    const d2 = dx * dx + dy * dy;
                    if (d2 >= minD * minD) continue;

                    const d = Math.sqrt(d2) || 1e-4;
                    const nx = dx / d;
                    const ny = dy / d;
                    const push = minD - d;

                    b.p.x += nx * push;
                    b.p.y += ny * push;
                    b.v.x += nx * push * CURSOR_KICK;
                    b.v.y += ny * push * CURSOR_KICK * 0.7;
                    b.v.z += (Math.random() - 0.5) * push * CURSOR_KICK * 0.5;

                    if (curVel) {
                        b.v.x += curVel.x * CURSOR_DRAG;
                        b.v.y += curVel.y * CURSOR_DRAG;
                    }
                }
            }

            // walls, floor, ceiling
            for (let i = 0; i < n; i++) {
                const b = balls[i];
                const r = b.r;

                if (b.p.y < r) {
                    b.p.y = r;
                    if (b.v.y < 0) b.v.y *= -WALL_BOUNCE;
                }
                if (b.p.y > ceiling - r) {
                    b.p.y = ceiling - r;
                    if (b.v.y > 0) b.v.y *= -WALL_BOUNCE;
                }
                if (b.p.x < -halfW + r) {
                    b.p.x = -halfW + r;
                    if (b.v.x < 0) b.v.x *= -WALL_BOUNCE;
                }
                if (b.p.x > halfW - r) {
                    b.p.x = halfW - r;
                    if (b.v.x > 0) b.v.x *= -WALL_BOUNCE;
                }
                if (b.p.z < -halfD + r) {
                    b.p.z = -halfD + r;
                    if (b.v.z < 0) b.v.z *= -WALL_BOUNCE;
                }
                if (b.p.z > halfD - r) {
                    b.p.z = halfD - r;
                    if (b.v.z > 0) b.v.z *= -WALL_BOUNCE;
                }

                b.v.multiplyScalar(DAMPING);

                // roll: spin about the axis perpendicular to travel
                const speed = b.v.length();
                if (speed > 1e-3) {
                    const axis = new THREE.Vector3()
                        .crossVectors(UP, b.v)
                        .normalize();
                    if (axis.lengthSq() > 0.5) {
                        b.q.premultiply(
                            new THREE.Quaternion().setFromAxisAngle(
                                axis,
                                (speed * dt) / b.r,
                            ),
                        );
                    }
                }
            }
        };
    }, [balls, width, depth, ceiling]);

    /* Settle the pile up front so it is already jammed on the first frame. */
    useMemo(() => {
        for (let i = 0; i < WARMUP_STEPS; i++) step(1 / 60, null, null);
    }, [step]);

    /* Instance colours, assigned once. */
    const palette = useMemo(
        () => colors.map((c) => new THREE.Color(c)),
        [colors],
    );
    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;
        balls.forEach((_, i) => {
            mesh.setColorAt(i, palette[i % palette.length]);
        });
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [balls, palette]);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const plane = useMemo(() => new THREE.Plane(), []);
    const ray = useMemo(() => new THREE.Raycaster(), []);
    const hit = useMemo(() => new THREE.Vector3(), []);
    const origin = useMemo(() => new THREE.Vector3(), []);
    const velTmp = useMemo(() => new THREE.Vector2(), []);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        // Cursor → the pit's local space, sampled on the mid-depth plane.
        let cur: THREE.Vector2 | null = null;
        let curVel: THREE.Vector2 | null = null;
        if (pointerActive.current && groupRef.current) {
            groupRef.current.getWorldPosition(origin);
            plane.setFromNormalAndCoplanarPoint(PLANE_NORMAL, origin);
            ray.setFromCamera(ndc.current, camera);
            if (ray.ray.intersectPlane(plane, hit)) {
                groupRef.current.worldToLocal(hit);
                if (cursor.current) {
                    // Cursor travel since last frame, so a sweep shoves balls
                    // along with it instead of only pushing them radially.
                    velTmp.set(
                        hit.x - cursor.current.x,
                        hit.y - cursor.current.y,
                    );
                    curVel = velTmp;
                } else {
                    cursor.current = new THREE.Vector2();
                }
                cursor.current.set(hit.x, hit.y);
                cur = cursor.current;
            }
        } else {
            cursor.current = null;
        }

        const dt = Math.min(delta, 1 / 30) / SUBSTEPS;
        for (let s = 0; s < SUBSTEPS; s++) step(dt, cur, curVel);

        for (let i = 0; i < balls.length; i++) {
            const b = balls[i];
            dummy.position.copy(b.p);
            dummy.quaternion.copy(b.q);
            dummy.scale.setScalar(b.r);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={groupRef}>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, balls.length]}
                castShadow
                receiveShadow
            >
                <sphereGeometry args={[1, 20, 20]} />
                {/* No metalness: there is no environment map in the scene, so
                    anything metallic would render as a dark blob. Value alone
                    separates the balls now that colour is gone. */}
                <meshStandardMaterial
                    roughness={0.5}
                    metalness={0}
                    bumpMap={dimple}
                    bumpScale={0.06}
                />
            </instancedMesh>
        </group>
    );
};

export default BallPit;
