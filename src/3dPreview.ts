import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

export interface Preview3DViewer {
  container: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  currentModel: THREE.Object3D | null;
  render: () => void;
}

const panoramaImageUrl = "./img/tactical-kyber-lab-equirectangular.png";
const hdriImageUrl = "./img/tactical-kyber-lab.hdr";

function initialize3DPreviewer(containerId: string): Preview3DViewer {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error("Model viewer container not found");
  }

  const width = 256;
  const height = 512;
  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101722);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
  camera.position.set(0, 0, 200);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x303040, 2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(100, 200, 150);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8abfff, 1.5);
  fillLight.position.set(-100, 50, -100);
  scene.add(fillLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  renderer.domElement.style.cursor = "grab";
  renderer.domElement.addEventListener("pointerdown", () => {
    renderer.domElement.style.cursor = "grabbing";
  });
  renderer.domElement.addEventListener("pointerup", () => {
    renderer.domElement.style.cursor = "grab";
  });
  const viewer: Preview3DViewer = {
    container,
    scene,
    camera,
    renderer,
    controls,
    currentModel: null,
    render: () => {
      renderer.render(scene, camera);
    },
  };

  applyHdriEnvironment(viewer, hdriImageUrl, panoramaImageUrl);

  controls.addEventListener("change", viewer.render);
  enableDeviceOrientationControls(viewer);

  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    viewer.render();
  });

  resizeObserver.observe(container);

  viewer.render();

  return viewer;
}
function removeObject(obj: THREE.Object3D<THREE.Object3DEventMap>) {
  if (!(obj instanceof THREE.Mesh)) {
    return;
  }

  if (Array.isArray(obj.material)) {
    obj.material.forEach((material) => material.dispose());
  } else {
    obj.material.dispose();
  }

  obj.geometry.dispose();
  obj.dispose();
}
export function replace3DModel(viewer: Preview3DViewer, file3mf: string, readyCallback: () => void): void {
  const objs = viewer.scene.getObjectsByProperty("name", "saber");
  objs.forEach((o) => {
    viewer.scene.remove(o);
    removeObject(o);
  });

  viewer.render();
  const loader = new ThreeMFLoader();
  loader.load(
    file3mf,
    (model) => {
      model.name = "saber";
      applyMetallicMaterials(model);

      model.rotation.x = -Math.PI / 2;

      viewer.scene.add(model);
      viewer.currentModel = model;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const distance = maxDimension * 1.5;

      viewer.camera.position.set(0, 0, distance);
      viewer.camera.near = Math.max(maxDimension / 1000, 0.01);
      viewer.camera.far = Math.max(maxDimension * 100, 1000);
      viewer.camera.updateProjectionMatrix();

      viewer.controls.target.set(0, 0, 0);
      viewer.controls.update();

      const blade = viewer.currentModel.getObjectByName("OpenSCAD Model 5");
      if (blade) {
        applyBladeMaterial(blade);
      }

      viewer.render();
      readyCallback();
    },
    undefined,
    (error) => {
      console.error("Unable to load 3MF model:", error);
    },
  );
}

let viewer: Preview3DViewer | null = null;

export function preview3D(containerId: string): Preview3DViewer {
  if (!viewer) {
    viewer = initialize3DPreviewer(containerId);
  }
  return viewer;
}
function applyHdriEnvironment(viewer: Preview3DViewer, hdriUrl: string, backgroundUrl?: string): void {
  const hdrLoader = new HDRLoader();
  const textureLoader = new THREE.TextureLoader();

  hdrLoader.load(
    hdriUrl,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const pmremGenerator = new THREE.PMREMGenerator(viewer.renderer);
      viewer.scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
      texture.dispose();
      pmremGenerator.dispose();
      viewer.render();
    },
    undefined,
    (error) => {
      console.error("Unable to load HDRI environment:", error);
    },
  );

  if (backgroundUrl) {
    textureLoader.load(
      backgroundUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping = THREE.EquirectangularReflectionMapping;

        viewer.scene.background = texture;
      },
      undefined,
      (error) => {
        console.error("Unable to load panorama background:", error);
      },
    );
  }
}

const orientationEventType =
  "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";

let accelerometerEnabled = false;
let accelerometerBaselineBeta: number | null = null;
let accelerometerBaselineGamma: number | null = null;
const accelerometerBaselineSpherical = new THREE.Spherical();
const accelerometerCurrentOffset = new THREE.Vector3();
const accelerometerNextOffset = new THREE.Vector3();
const accelerometerRotationSensitivity = 0.02;
let accelerometerListenerAttached = false;

function handleAccelerometerOrientation(event: DeviceOrientationEvent): void {
  if (!accelerometerEnabled || !viewer) {
    return;
  }

  if (event.beta === null || event.gamma === null) {
    return;
  }

  accelerometerCurrentOffset.copy(viewer.camera.position).sub(viewer.controls.target);

  if (accelerometerBaselineBeta === null || accelerometerBaselineGamma === null) {
    accelerometerBaselineBeta = event.beta;
    accelerometerBaselineGamma = event.gamma;
    accelerometerBaselineSpherical.setFromVector3(accelerometerCurrentOffset);
    return;
  }

  const betaDelta = event.beta - accelerometerBaselineBeta;
  const gammaDelta = event.gamma - accelerometerBaselineGamma;

  const nextSpherical = accelerometerBaselineSpherical.clone();
  nextSpherical.radius = accelerometerCurrentOffset.length();
  nextSpherical.theta -= gammaDelta * accelerometerRotationSensitivity;
  nextSpherical.phi -= betaDelta * accelerometerRotationSensitivity;
  nextSpherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, nextSpherical.phi));

  accelerometerNextOffset.setFromSpherical(nextSpherical);
  viewer.camera.position.copy(viewer.controls.target).add(accelerometerNextOffset);
  viewer.camera.lookAt(viewer.controls.target);

  viewer.controls.update();
  viewer.render();
}

async function requestAccelerometerPermission(): Promise<boolean> {
  if (!("DeviceOrientationEvent" in window)) {
    return false;
  }

  const deviceOrientationEvent = DeviceOrientationEvent as DeviceOrientationEventWithPermission;

  if (typeof deviceOrientationEvent.requestPermission === "function") {
    const permission = await deviceOrientationEvent.requestPermission();
    return permission === "granted";
  }

  return true;
}

function enableDeviceOrientationControls(viewerInstance: Preview3DViewer): void {
  viewerInstance.container.addEventListener("pointerdown", () => void activateAccelerometer(true), { once: true });
  viewerInstance.container.addEventListener("touchstart", () => void activateAccelerometer(true), { once: true, passive: true });
}

export async function activateAccelerometer(enable: boolean): Promise<void> {
  if (enable === accelerometerEnabled) {
    return;
  }

  if (enable) {
    const granted = await requestAccelerometerPermission();
    if (!granted) {
      return;
    }

    accelerometerEnabled = true;
    accelerometerBaselineBeta = null;
    accelerometerBaselineGamma = null;
    if (!accelerometerListenerAttached) {
      window.addEventListener(orientationEventType, handleAccelerometerOrientation, true);
      accelerometerListenerAttached = true;
    }
  } else {
    accelerometerEnabled = false;
    accelerometerBaselineBeta = null;
    accelerometerBaselineGamma = null;
    if (accelerometerListenerAttached) {
      window.removeEventListener(orientationEventType, handleAccelerometerOrientation, true);
      accelerometerListenerAttached = false;
    }
  }
}

function applyMetallicMaterials(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    const materials = Array.isArray(child.material) ? child.material : [child.material];

    const metallicMaterials = materials.map((material) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.metalness = 0.85;
        material.roughness = 0.25;
        material.needsUpdate = true;
        return material;
      }

      return new THREE.MeshStandardMaterial({
        color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
        map: "map" in material ? material.map : null,
        vertexColors: "vertexColors" in material ? material.vertexColors : false,
        flatShading: "flatShading" in material ? material.flatShading : false,
        opacity: material.opacity,
        transparent: material.transparent,
        side: material.side,
        metalness: 0.85,
        roughness: 0.25,
      });
    });

    child.material = Array.isArray(child.material) ? metallicMaterials : metallicMaterials[0];
  });
}

function applyBladeMaterial(object: THREE.Object3D): void {
  const meshes: THREE.Mesh[] = [];
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  meshes.forEach((mesh) => {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    let baseColor = new THREE.Color(0xffffff);

    const bladeMaterials = materials.map((material) => {
      if ("color" in material && material.color instanceof THREE.Color) {
        baseColor = material.color.clone();
      }

      return new THREE.MeshBasicMaterial({
        color: baseColor,
        map: "map" in material && material.map instanceof THREE.Texture ? material.map : null,
        vertexColors:
          "vertexColors" in material && typeof material.vertexColors === "boolean" ? material.vertexColors : false,
        opacity: typeof material.opacity === "number" && material.opacity < 0.85 ? material.opacity : 0.85,
        transparent: true,
        side: material.side,
        depthWrite: false,
        toneMapped: false,
      });
    });

    mesh.material = Array.isArray(mesh.material) ? bladeMaterials : bladeMaterials[0];

    if (!mesh.geometry.attributes.normal) {
      mesh.geometry.computeVertexNormals();
    }

    mesh.geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    if (mesh.geometry.boundingBox) {
      mesh.geometry.boundingBox.getSize(size);
    }

    const radius = Math.max(Math.min(size.x || 12.5, size.y || 12.5) / 2, 1);

    const glowLayers = [
      { offset: radius * 0.12, opacity: 0.5 },
      { offset: radius * 0.28, opacity: 0.3 },
      { offset: radius * 0.55, opacity: 0.18 },
      { offset: radius * 0.95, opacity: 0.08 },
      { offset: radius * 1.5, opacity: 0.03 },
    ];

    glowLayers.forEach(({ offset, opacity }) => {
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: baseColor.clone() },
          offset: { value: offset },
          opacity: { value: opacity },
        },
        vertexShader: `
          uniform float offset;
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec3 displaced = position + normal * offset;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          uniform float opacity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))) * 0.3, 1.2) * opacity;
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });

      const glowMesh = new THREE.Mesh(mesh.geometry, glowMaterial);
      mesh.add(glowMesh);
    });

    const bladeLight = new THREE.PointLight(baseColor, 3, Math.max(size.z * 1.5, 200));
    if (mesh.geometry.boundingBox) {
      const center = new THREE.Vector3();
      mesh.geometry.boundingBox.getCenter(center);
      bladeLight.position.copy(center);
    }
    mesh.add(bladeLight);
  });
}
