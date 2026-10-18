import * as THREE from "three";

import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export function preview3D(file3mf: string) {
  const container = document.getElementById("preview");

  if (!container) {
    throw new Error("Model viewer container not found");
  }

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101722);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);

  camera.position.set(150, 150, 200);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  container.appendChild(renderer.domElement);

  // Environment map
  // Provides reflections for metallic materials.

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const environment = new RoomEnvironment();

  scene.environment = pmremGenerator.fromScene(environment).texture;

  environment.dispose();

  pmremGenerator.dispose();

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x303040, 2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);

  keyLight.position.set(100, 200, 150);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8abfff, 1.5);

  fillLight.position.set(-100, 50, -100);
  scene.add(fillLight);

  // Additional light for metallic highlights.
  const rimLight = new THREE.DirectionalLight(0xffffff, 2);

  rimLight.position.set(0, 100, -150);

  scene.add(rimLight);

  // Metallic materials
  // Preserve original colors and vertex colors.
  function applyMetallicMaterials(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material];

      const metallicMaterials = materials.map((material) => {
        // Preserve existing physically based materials.
        if (material instanceof THREE.MeshStandardMaterial) {
          material.metalness = 0.85;
          material.roughness = 0.25;

          material.needsUpdate = true;

          return material;
        }

        // Convert other materials while retaining
        // their original color-related properties.
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
  // Camera controls
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Load the 3MF model
  const loader = new ThreeMFLoader();

  loader.load(
    file3mf,

    (model) => {
      // Apply metallic rendering without replacing
      // the original model colors.
      applyMetallicMaterials(model);

      scene.add(model);

      // Center the model around the origin.
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      model.position.sub(center);

      // Adjust the camera to fit the model.
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);

      const distance = maxDimension * 2.5;

      camera.position.set(distance, distance, distance);

      camera.near = Math.max(maxDimension / 1000, 0.01);
      camera.far = Math.max(maxDimension * 100, 1000);
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.update();
    },

    undefined,

    (error) => {
      console.error("Unable to load 3MF model:", error);
    },
  );

  // Rendering loop
  function animate(): void {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Keep the viewer responsive.
  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });

  resizeObserver.observe(container);
}
