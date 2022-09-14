uniform vec3 uColor;
uniform float uTime;
uniform float uFreq;
uniform float uBorder;
uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;

void main()
{
    float limit = 1.0-abs(2.0*fract(uFreq*uTime) - 1.0);

    vec4 textureColor = texture2D(uTexture, vUv);
    float level = texture2D(uNoiseTexture, vUv).x;

    if (level > limit - uBorder && level < limit) {
        gl_FragColor = vec4(1.0) * textureColor.a;
    } else {
        gl_FragColor = textureColor * step(limit, level);
    }
}
