import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === 조명 ===
scene.add(new THREE.AmbientLight(0x404040, 2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// === GLB 로드 ===
const loader = new GLTFLoader();
loader.load(
  './room.glb',
  gltf => {
    gltf.scene.scale.set(100, 100, 100);
    scene.add(gltf.scene);
  },
  undefined,
  error => {
    console.error('GLB 로딩 오류:', error);
  }
);

// === 컨트롤 (FPS 방식) ===
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());
controls.pointerSpeed = 0.5; // 🔥 마우스 감도 절반으로 줄임

// 마우스 클릭 시 포인터 잠금
document.body.addEventListener('click', () => {
  controls.lock();
});

// === 이동 상태 변수 ===
const move = { forward: false, backward: false, left: false, right: false };

document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
  }
});

// === 애니메이션 루프 ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const speed = 3.0; // 걷는 속도 (초당 3 유닛)

  if (move.forward) controls.moveForward(speed * delta);
  if (move.backward) controls.moveForward(-speed * delta);
  if (move.left) controls.moveRight(-speed * delta);
  if (move.right) controls.moveRight(speed * delta);

  renderer.render(scene, camera);
}
animate();

// === 리사이즈 대응 ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

