import './App.css'
import {Canvas, extend, useFrame} from "@react-three/fiber";
import {OrbitControls, shaderMaterial, useTexture} from "@react-three/drei";
import fragment from "./shaders/fragment.glsl?raw";
import vertex from "./shaders/vertex.glsl?raw";
import {Mesh} from "three";
import {useMemo, useRef} from "react";
import {useControls} from "leva";

const ColorMaterial = shaderMaterial(
    {
        uTime: 0,
        uFreq: 5.0,
        uBorder: 0.05,
        uTexture: null,
        uNoiseTexture: null,
    },
    // the tag is optional, it allows the VSC to syntax highlibht and lint glsl,
    // also allows imports and other things
    vertex,
    fragment
)
extend({ColorMaterial})

function GetMesh() {
    const [gopherTexture, noiseTexture] = useTexture(['/textures/gopher_cropped.png', '/textures/noise.png'])

    const {speed, border} = useControls({
        speed: {
            value: 0.2,
            min: 0.05,
            max: 1.0,
            step: 0.05,
            label: 'speed',
        },
        border: {
            value: 0.15,
            min: 0.01,
            max: 0.40,
            step: 0.05
        }
    })


    const randoms = useMemo(() => {
        const count = 1681
        const randoms = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random()
        }
        return randoms;
    }, []);

    const ref = useRef<Mesh>();
    useFrame((state, delta) => {
        if (!ref.current) return
        ref.current.material.uTime += delta
        ref.current.rotation.y = Math.sin(state.clock.elapsedTime) / 4
    })

    return <mesh ref={ref} rotation={[0, 0, 0]} position={[0, 0, 0]}>
        {/*<boxGeometry args={[2, 2, 2, 40]}>*/}
        <planeGeometry attach="geometry" args={[5, 5, 100, 100]}>
            <bufferAttribute
                attach={'attributes-aRandom'}
                count={randoms.length / 1}
                array={randoms}
                itemSize={1}
            />
        </planeGeometry>
        {/*<meshStandardMaterial color="hotpink"/>*/}
        <colorMaterial key={ColorMaterial.key}
                       uFreq={speed}
                       uBorder={border}
                       uTexture={gopherTexture}
                       uNoiseTexture={noiseTexture}
        />
    </mesh>;
}

function App() {
    return (
        <>
            <Canvas>
                <OrbitControls/>
                <GetMesh/>
            </Canvas>
            <ul className="credits">
                <li>🧛 By <a href="https://twitter.com/Wahlstra">@Wahlstra</a> with ThreeJS (R3F). Source <a
                    href="https://github.com/magnuswahlstrand/demo-threejs-fiber-rooms">here</a></li>
                <li>🧊 Inspiration by Bruno Simon's <a href="https://threejs-journey.com/">excellent course on Three
                    JS</a></li>
                <li>🐻‍❄️ Gopher by <a href="http://reneefrench.blogspot.com/">Renee French</a>.</li>
            </ul>
        </>
    )
}

export default App
