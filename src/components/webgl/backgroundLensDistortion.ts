import * as THREE from 'three';

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = `
uniform sampler2D tDiffuse;
uniform float strength;
uniform float vignette;
varying vec2 vUv;

void main() {
  vec2 c = vUv - 0.5;
  float r2 = dot(c, c);
  float bend = strength * r2 + strength * 0.55 * r2 * r2;
  vec2 d = c * (1.0 + bend) + 0.5;

  vec4 col = texture2D(tDiffuse, d);
  float vig = 1.0 - vignette * smoothstep(0.15, 0.92, sqrt(r2) * 1.15);
  col.rgb *= vig;
  gl_FragColor = col;
}
`;

export interface LensDistortionPass {
  resize: (width: number, height: number) => void;
  setStrength: (strength: number, vignette: number) => void;
  render: (
    gl: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) => void;
  dispose: () => void;
}

export function createLensDistortionPass(
  width: number,
  height: number,
  dpr: number
): LensDistortionPass {
  const w = Math.max(1, Math.floor(width * dpr));
  const h = Math.max(1, Math.floor(height * dpr));

  const target = new THREE.WebGLRenderTarget(w, h, {
    depthBuffer: true,
    stencilBuffer: false,
  });
  target.texture.colorSpace = THREE.SRGBColorSpace;
  target.texture.wrapS = THREE.ClampToEdgeWrapping;
  target.texture.wrapT = THREE.ClampToEdgeWrapping;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: target.texture },
      strength: { value: 0.42 },
      vignette: { value: 0.32 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  const quadScene = new THREE.Scene();
  quadScene.add(quad);
  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let fovOverscan = 1.28;

  function updateFovOverscan(strength: number) {
    const maxR2 = 0.5;
    const edgeSample = 1 + strength * maxR2 + strength * 0.55 * maxR2 * maxR2;
    fovOverscan = 1.04 + (edgeSample - 1) * 1.45;
  }

  updateFovOverscan(material.uniforms.strength.value as number);

  return {
    resize(nextWidth: number, nextHeight: number) {
      const rw = Math.max(1, Math.floor(nextWidth * dpr));
      const rh = Math.max(1, Math.floor(nextHeight * dpr));
      target.setSize(rw, rh);
    },
    setStrength(strength: number, vignette: number) {
      material.uniforms.strength.value = strength;
      material.uniforms.vignette.value = vignette;
      updateFovOverscan(strength);
    },
    render(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
      const prevTarget = gl.getRenderTarget();
      const prevAutoClear = gl.autoClear;

      const persp = camera as THREE.PerspectiveCamera;
      const savedFov = persp.isPerspectiveCamera ? persp.fov : null;
      if (savedFov !== null) {
        persp.fov = savedFov * fovOverscan;
        persp.updateProjectionMatrix();
      }

      gl.setRenderTarget(target);
      gl.autoClear = true;
      gl.setClearColor(0x000000, 0);
      gl.clear(true, true);
      gl.render(scene, camera);

      if (savedFov !== null) {
        persp.fov = savedFov;
        persp.updateProjectionMatrix();
      }

      gl.setRenderTarget(prevTarget);
      gl.autoClear = true;
      gl.setClearColor(0x000000, 0);
      gl.clear(true, true);
      gl.render(quadScene, quadCamera);

      gl.autoClear = prevAutoClear;
    },
    dispose() {
      target.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}
