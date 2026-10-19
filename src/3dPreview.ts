import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface Preview3DViewer {
  container: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  currentModel: THREE.Object3D | null;
  render: () => void;
}

export function initialize3DPreviewer(containerId = "preview"): Preview3DViewer {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error("Model viewer container not found");
  }

  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101722);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
  camera.position.set(0, 0, 200);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  scene.environment = pmremGenerator.fromScene(environment).texture;
  environment.dispose();
  pmremGenerator.dispose();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x303040, 2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(100, 200, 150);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8abfff, 1.5);
  fillLight.position.set(-100, 50, -100);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 2);
  rimLight.position.set(0, 100, -150);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);

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

  controls.addEventListener("change", viewer.render);

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

export function replace3DModel(viewer: Preview3DViewer, file3mf: string): void {
  if (viewer.currentModel) {
    viewer.scene.remove(viewer.currentModel);
    viewer.currentModel.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }

      child.geometry.dispose();
    });
    viewer.currentModel = null;
  }

  const loader = new ThreeMFLoader();

  loader.load(
    file3mf,
    (model) => {
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

      viewer.render();
    },
    undefined,
    (error) => {
      console.error("Unable to load 3MF model:", error);
    },
  );
}

let viewer: Preview3DViewer | null = null;

export function preview3D(file3mf: string): Preview3DViewer {
  if (!viewer) {
    viewer = initialize3DPreviewer();
  }
  replace3DModel(viewer, file3mf);
  return viewer;
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
