import * as THREE from "three";

import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x303040, 2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);

  keyLight.position.set(100, 200, 150);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8abfff, 1.5);

  fillLight.position.set(-100, 50, -100);
  scene.add(fillLight);

  // Camera controls
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Load the 3MF model
  const loader = new ThreeMFLoader();

  loader.load(
    file3mf,

    (model) => {
      // ThreeMFLoader handles the model's supported materials.
      // Avoid replacing them with a single generic material.

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
