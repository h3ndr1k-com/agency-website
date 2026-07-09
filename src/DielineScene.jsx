import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// FEFCO 0201 regular slotted carton, folding flat → assembled as `progress.current` goes 0 → 1.
const L = 3;      // length (x)
const W = 2;      // width (z)
const H = 1.9;    // height (y)
const FLAP = W / 2;

const AMBER = '#F59E0B';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

const edgeLine = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.45 });
const fluteLine = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.1 });
const hingeLine = new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.9 });
const fillMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.03, side: THREE.DoubleSide, depthWrite: false });

function panelGeometries(w, h, flutes) {
    const plane = new THREE.PlaneGeometry(w, h);
    const edges = new THREE.EdgesGeometry(plane);
    let fluteGeo = null;
    if (flutes > 0) {
        const pts = [];
        for (let i = 1; i < flutes; i++) {
            const x = -w / 2 + (w / flutes) * i;
            pts.push(x, -h / 2, 0, x, h / 2, 0);
        }
        fluteGeo = new THREE.BufferGeometry();
        fluteGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    }
    return { plane, edges, fluteGeo };
}

// A cut panel: edge outline + faint corrugation flutes + near-invisible fill.
const Panel = ({ w, h, flutes = 0, ...props }) => {
    const { plane, edges, fluteGeo } = useMemo(() => panelGeometries(w, h, flutes), [w, h, flutes]);
    return (
        <group {...props}>
            <lineSegments geometry={edges} material={edgeLine} />
            {fluteGeo && <lineSegments geometry={fluteGeo} material={fluteLine} />}
            <mesh geometry={plane} material={fillMat} />
        </group>
    );
};

// Amber crease line along a hinge.
const Hinge = ({ length, ...props }) => {
    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute([-length / 2, 0, 0, length / 2, 0, 0], 3));
        return g;
    }, [length]);
    return <lineSegments geometry={geo} material={hingeLine} {...props} />;
};

function Carton({ progress }) {
    const root = useRef();
    const fold = useRef(0);

    const frontWall = useRef();
    const backWall = useRef();
    const leftWall = useRef();
    const rightWall = useRef();
    const frontFlap = useRef();
    const backFlap = useRef();
    const leftFlap = useRef();
    const rightFlap = useRef();
    const corners = useRef();
    const scan = useRef();

    const cornerGeo = useMemo(() => {
        const pts = [];
        for (const sx of [-1, 1]) for (const sy of [0, 1]) for (const sz of [-1, 1]) {
            pts.push((sx * L) / 2, sy * H, (sz * W) / 2);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        return g;
    }, []);

    const scanGeo = useMemo(() => new THREE.PlaneGeometry(L + 1.2, W + 1.2), []);
    const scanMat = useMemo(
        () => new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
        []
    );
    const pointsMat = useMemo(() => new THREE.PointsMaterial({ color: AMBER, size: 0.07, transparent: true, opacity: 0 }), []);

    useFrame((state, dt) => {
        fold.current = THREE.MathUtils.damp(fold.current, progress.current, 3.2, dt);
        const f = fold.current;

        const wallT = smooth(clamp01(f / 0.55));
        const sideFlapT = smooth(clamp01((f - 0.5) / 0.25));
        const mainFlapT = smooth(clamp01((f - 0.72) / 0.28));

        const wallA = (Math.PI / 2) * (1 - wallT);
        if (frontWall.current) frontWall.current.rotation.x = wallA;
        if (backWall.current) backWall.current.rotation.x = -wallA;
        if (rightWall.current) rightWall.current.rotation.z = -wallA;
        if (leftWall.current) leftWall.current.rotation.z = wallA;

        if (leftFlap.current) leftFlap.current.rotation.z = (Math.PI / 2) * sideFlapT;
        if (rightFlap.current) rightFlap.current.rotation.z = -(Math.PI / 2) * sideFlapT;
        if (frontFlap.current) frontFlap.current.rotation.x = -(Math.PI / 2) * mainFlapT;
        if (backFlap.current) backFlap.current.rotation.x = (Math.PI / 2) * mainFlapT;

        if (corners.current) corners.current.material.opacity = mainFlapT * 0.9;

        if (root.current) {
            root.current.rotation.y += dt * 0.14;
            root.current.rotation.x = THREE.MathUtils.lerp(0.52, 0.12, wallT);
        }

        if (scan.current) {
            const t = (state.clock.elapsedTime % 3.2) / 3.2;
            scan.current.position.y = t * (H + 0.7) - 0.2;
            scan.current.material.opacity = 0.07 * Math.sin(t * Math.PI);
        }
    });

    return (
        <group ref={root} position={[0, -H / 2 + 0.15, 0]}>
            {/* base */}
            <Panel w={L} h={W} rotation-x={-Math.PI / 2} flutes={12} />
            <Hinge length={L} position={[0, 0, W / 2]} />
            <Hinge length={L} position={[0, 0, -W / 2]} />
            <Hinge length={W} position={[L / 2, 0, 0]} rotation-y={Math.PI / 2} />
            <Hinge length={W} position={[-L / 2, 0, 0]} rotation-y={Math.PI / 2} />

            {/* front / back walls + outer flaps */}
            <group ref={frontWall} position={[0, 0, W / 2]}>
                <Panel w={L} h={H} position={[0, H / 2, 0]} flutes={12} />
                <group ref={frontFlap} position={[0, H, 0]}>
                    <Panel w={L} h={FLAP} position={[0, FLAP / 2, 0]} />
                    <Hinge length={L} />
                </group>
            </group>
            <group ref={backWall} position={[0, 0, -W / 2]}>
                <Panel w={L} h={H} position={[0, H / 2, 0]} flutes={12} />
                <group ref={backFlap} position={[0, H, 0]}>
                    <Panel w={L} h={FLAP} position={[0, FLAP / 2, 0]} />
                    <Hinge length={L} />
                </group>
            </group>

            {/* left / right walls + inner flaps */}
            <group ref={rightWall} position={[L / 2, 0, 0]}>
                <Panel w={W} h={H} rotation-y={Math.PI / 2} position={[0, H / 2, 0]} flutes={8} />
                <group ref={rightFlap} position={[0, H, 0]}>
                    <Panel w={W} h={FLAP} rotation-y={Math.PI / 2} position={[0, FLAP / 2, 0]} />
                    <Hinge length={W} rotation-y={Math.PI / 2} />
                </group>
            </group>
            <group ref={leftWall} position={[-L / 2, 0, 0]}>
                <Panel w={W} h={H} rotation-y={Math.PI / 2} position={[0, H / 2, 0]} flutes={8} />
                <group ref={leftFlap} position={[0, H, 0]}>
                    <Panel w={W} h={FLAP} rotation-y={Math.PI / 2} position={[0, FLAP / 2, 0]} />
                    <Hinge length={W} rotation-y={Math.PI / 2} />
                </group>
            </group>

            {/* corner registration points — appear as the carton closes */}
            <points ref={corners} geometry={cornerGeo} material={pointsMat} />

            {/* inspection scan sweep */}
            <mesh ref={scan} geometry={scanGeo} material={scanMat} rotation-x={-Math.PI / 2} />
        </group>
    );
}

export default function DielineScene({ progress }) {
    return (
        <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [4.6, 3.1, 5.8], fov: 36 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            style={{ background: 'transparent' }}
        >
            <Carton progress={progress} />
        </Canvas>
    );
}
