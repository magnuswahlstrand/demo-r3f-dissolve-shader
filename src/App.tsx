import './App.css'
import {Canvas, extend, useFrame} from "@react-three/fiber";
import {OrbitControls, shaderMaterial, useTexture} from "@react-three/drei";
import fragment from "./shaders/fragment.glsl?raw";
import vertex from "./shaders/vertex.glsl?raw";
import {Mesh} from "three";
import {useRef} from "react";
import {useControls} from "leva";

const ColorMaterial = shaderMaterial(
    {
        uTime: 0,
        uFreq: 5.0,
        uBorder: 0.05,
        uTexture: null,
        uNoiseTexture: null,
    },
    vertex,
    fragment
)
extend({ColorMaterial})

function useShaderControls() {
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
    return {speed, border};
}

function GetMesh() {
    const [gopherTexture, noiseTexture] = useTexture(['/textures/gopher_cropped.png', '/textures/noise.png'])
    const {speed, border} = useShaderControls();

    const ref = useRef<Mesh>(null);
    useFrame((state, delta) => {
        if (!ref.current) return
        // @ts-ignore
        ref.current.material.uTime += delta
        ref.current.rotation.y = Math.sin(state.clock.elapsedTime) / 4
    })


    return <mesh ref={ref} rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry attach="geometry" args={[5, 5, 100, 100]}/>
        {/*@ts-ignore                */}
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
                    href="https://github.com/magnuswahlstrand/demo-r3f-dissolve-shader">here</a></li>
                <li>🧊 Inspiration by Bruno Simon's <a href="https://threejs-journey.com/">excellent course on Three
                    JS</a></li>
                <li>🐻‍❄️ Gopher by <a href="http://reneefrench.blogspot.com/">Renee French</a>.</li>
            </ul>
        </>
    )
}

export default App
