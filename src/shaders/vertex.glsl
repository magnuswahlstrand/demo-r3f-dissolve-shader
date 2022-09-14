uniform vec2 uFrequency;
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = uv;
}
