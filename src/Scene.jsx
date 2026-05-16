import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeRing(color) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.012, 10, 96),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.48,
    }),
  );
  ring.rotation.x = Math.PI / 2.4;
  return ring;
}

function makeNode(project) {
  const group = new THREE.Group();
  group.position.set(...project.position);
  group.userData.projectId = project.id;

  const color = new THREE.Color(project.color);
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.36, 2),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.22,
      metalness: 0.45,
      emissive: color,
      emissiveIntensity: 0.34,
    }),
  );
  core.userData.projectId = project.id;

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 32, 32),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.09,
    }),
  );

  const ringA = makeRing(color);
  const ringB = makeRing(color);
  ringB.rotation.y = Math.PI / 2;

  group.add(halo, core, ringA, ringB);
  group.userData.core = core;
  group.userData.halo = halo;
  group.userData.rings = [ringA, ringB];
  return group;
}

export default function Scene({
  activeId,
  boostOn,
  scannerOn,
  onSelect,
  onSelectIndex,
  projects,
}) {
  const mountRef = useRef(null);
  const latestRef = useRef({ activeId, boostOn, scannerOn, onSelect, onSelectIndex });

  useEffect(() => {
    latestRef.current = { activeId, boostOn, scannerOn, onSelect, onSelectIndex };
  }, [activeId, boostOn, scannerOn, onSelect, onSelectIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070d, 0.045);

    const camera = new THREE.PerspectiveCamera(
      56,
      window.innerWidth / window.innerHeight,
      0.1,
      120,
    );
    camera.position.set(0, 0.45, 10.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    const nodeLayer = new THREE.Group();
    const lineLayer = new THREE.Group();
    scene.add(root, nodeLayer, lineLayer);

    const pointer = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const clickable = [];
    const projectNodes = new Map();

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1450;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const palette = [new THREE.Color("#f6f0e8"), new THREE.Color("#7be0c3"), new THREE.Color("#ffcf66")];

    for (let index = 0; index < starCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 44;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 34;
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.034,
        vertexColors: true,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      }),
    );
    root.add(stars);

    const grid = new THREE.GridHelper(15, 15, 0x7be0c3, 0x263542);
    grid.position.y = -3.65;
    grid.material.transparent = true;
    grid.material.opacity = 0.17;
    root.add(grid);

    const nodeGroups = projects.map((project) => {
      const node = makeNode(project);
      projectNodes.set(project.id, node);
      clickable.push(node.userData.core);
      nodeLayer.add(node);
      return node;
    });

    for (let index = 0; index < projects.length; index += 1) {
      const current = new THREE.Vector3(...projects[index].position);
      const next = new THREE.Vector3(...projects[(index + 1) % projects.length].position);
      const geometry = new THREE.BufferGeometry().setFromPoints([current, next]);
      const material = new THREE.LineBasicMaterial({
        color: 0x7be0c3,
        transparent: true,
        opacity: 0.16,
      });
      lineLayer.add(new THREE.Line(geometry, material));
    }

    scene.add(new THREE.AmbientLight(0xbfd7ff, 1.2));

    const keyLight = new THREE.PointLight(0xffcf66, 58, 42);
    keyLight.position.set(5, 4, 8);
    scene.add(keyLight);

    const tealLight = new THREE.PointLight(0x7be0c3, 34, 34);
    tealLight.position.set(-6, -2, 6);
    scene.add(tealLight);

    function handlePointerMove(event) {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    }

    function handleClick(event) {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(clickable, false)[0];
      if (hit?.object?.userData?.projectId) {
        latestRef.current.onSelect(hit.object.userData.projectId);
      }
    }

    function handleKeyDown(event) {
      const number = Number(event.key);
      if (number >= 1 && number <= projects.length) {
        latestRef.current.onSelectIndex(number - 1);
      }
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    function animate() {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { activeId: currentActiveId, boostOn: currentBoost, scannerOn: currentScanner } =
        latestRef.current;
      const speed = currentBoost ? 1.85 : 1;

      root.rotation.y += 0.0012 * speed;
      stars.rotation.y += 0.0009 * speed;
      grid.position.z = ((elapsed * speed) % 1) - 0.5;

      camera.position.x += (pointer.x * 1.35 - camera.position.x) * 0.035;
      camera.position.y += (0.45 + pointer.y * -0.75 - camera.position.y) * 0.035;
      camera.lookAt(0, -0.2, 0);

      nodeGroups.forEach((node, index) => {
        const isActive = node.userData.projectId === currentActiveId;
        const pulse = 1 + Math.sin(elapsed * 2.4 + index) * 0.04;
        const targetScale = (isActive ? 1.55 : 1) * pulse;
        node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.07);
        node.rotation.y += (0.012 + index * 0.001) * speed;
        node.rotation.x += 0.004 * speed;
        node.userData.halo.material.opacity = isActive ? 0.18 : 0.07;
        node.userData.rings.forEach((ring, ringIndex) => {
          ring.visible = currentScanner || isActive;
          ring.rotation.z += (0.01 + ringIndex * 0.006) * speed;
          ring.material.opacity = isActive ? 0.72 : 0.28;
        });
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      starGeometry.dispose();
      nodeGroups.forEach((node) => {
        node.traverse((child) => {
          child.geometry?.dispose();
          child.material?.dispose();
        });
      });
      lineLayer.traverse((child) => {
        child.geometry?.dispose();
        child.material?.dispose();
      });
    };
  }, [projects]);

  return <div className="scene" ref={mountRef} aria-hidden="true" />;
}
