import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeMaterial(color, emissive = color, intensity = 0.45) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.2,
    emissive,
    emissiveIntensity: intensity,
  });
}

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose());
    } else {
      child.material?.dispose();
    }
  });
}

export default function Scene({ activeProject, powerOn, projects }) {
  const mountRef = useRef(null);
  const latestRef = useRef({ activeProject, powerOn });

  useEffect(() => {
    latestRef.current = { activeProject, powerOn };
  }, [activeProject, powerOn]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x12091f, 0.038);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      120,
    );
    camera.position.set(0, 3.1, 10.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const pointer = new THREE.Vector2();
    const world = new THREE.Group();
    const skyline = new THREE.Group();
    const orbit = new THREE.Group();
    scene.add(world);
    world.add(skyline, orbit);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(4.8, 5.4, 0.48, 8),
      makeMaterial(0x2b1659, 0x5d28ff, 0.35),
    );
    platform.position.y = -1.9;
    platform.rotation.y = Math.PI / 8;
    world.add(platform);

    const platformEdge = new THREE.Mesh(
      new THREE.TorusGeometry(5.1, 0.035, 10, 160),
      new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.9,
      }),
    );
    platformEdge.position.y = -1.62;
    platformEdge.rotation.x = Math.PI / 2;
    world.add(platformEdge);

    const cabinet = new THREE.Group();
    const cabinetBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 2.5, 0.72),
      makeMaterial(0xff4fd8, 0xff4fd8, 0.32),
    );
    const cabinetScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.42, 0.82, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x0b1022,
        roughness: 0.18,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.8,
      }),
    );
    cabinetScreen.position.set(0, 0.36, 0.4);

    const controls = new THREE.Mesh(
      new THREE.BoxGeometry(1.54, 0.32, 0.54),
      makeMaterial(0xfff36d, 0xff9f1c, 0.4),
    );
    controls.position.set(0, -0.54, 0.52);
    cabinet.add(cabinetBody, cabinetScreen, controls);
    cabinet.position.set(0, -0.45, 0);
    cabinet.rotation.y = -0.12;
    world.add(cabinet);

    const towerGeometry = new THREE.BoxGeometry(0.58, 1, 0.58);
    const towers = projects.map((project, index) => {
      const tower = new THREE.Mesh(towerGeometry, makeMaterial(project.color, project.color, 0.42));
      const angle = (index / projects.length) * Math.PI * 2;
      const radius = 3.35;
      tower.position.set(Math.cos(angle) * radius, -1.12, Math.sin(angle) * radius);
      tower.scale.y = 0.9 + index * 0.36;
      tower.userData.baseScale = tower.scale.y;
      skyline.add(tower);

      const crown = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({ color: project.secondary }),
      );
      crown.position.set(tower.position.x, -0.52 + tower.scale.y / 2, tower.position.z);
      skyline.add(crown);
      tower.userData.crown = crown;
      return tower;
    });

    const padGeometry = new THREE.TorusGeometry(1.25, 0.018, 10, 100);
    const rings = [0, 1, 2].map((index) => {
      const ring = new THREE.Mesh(
        padGeometry,
        new THREE.MeshBasicMaterial({
          color: index === 0 ? 0x00e5ff : index === 1 ? 0xff4fd8 : 0xfff36d,
          transparent: true,
          opacity: 0.5,
        }),
      );
      ring.rotation.x = Math.PI / 2 + index * 0.18;
      ring.scale.setScalar(1 + index * 0.7);
      orbit.add(ring);
      return ring;
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorSet = ["#00e5ff", "#ff4fd8", "#fff36d", "#00ffa8", "#8f7cff"].map(
      (color) => new THREE.Color(color),
    );

    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 34;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 19;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 28;
      const color = colorSet[index % colorSet.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));

    const keyLight = new THREE.PointLight(0xfff36d, 70, 50);
    keyLight.position.set(4, 5, 8);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x00e5ff, 52, 44);
    fillLight.position.set(-5, 1, 7);
    scene.add(fillLight);

    function handlePointerMove(event) {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;

    function animate() {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { activeProject: currentProject, powerOn: currentPower } = latestRef.current;
      const activeColor = new THREE.Color(currentProject.color);
      const secondaryColor = new THREE.Color(currentProject.secondary);
      const auraColor = new THREE.Color(currentProject.aura);
      const speed = currentPower ? 1.45 : 0.72;

      world.rotation.y += 0.003 * speed;
      orbit.rotation.y -= 0.012 * speed;
      particles.rotation.y += 0.0009 * speed;
      cabinet.rotation.y = Math.sin(elapsed * 0.8) * 0.18;
      cabinet.position.y = -0.42 + Math.sin(elapsed * 1.7) * 0.08;

      cabinetBody.material.color.lerp(activeColor, 0.045);
      cabinetBody.material.emissive.lerp(activeColor, 0.045);
      cabinetScreen.material.emissive.lerp(secondaryColor, 0.05);
      controls.material.color.lerp(auraColor, 0.05);
      platformEdge.material.color.lerp(activeColor, 0.045);
      keyLight.color.lerp(auraColor, 0.04);
      fillLight.color.lerp(secondaryColor, 0.04);

      towers.forEach((tower, index) => {
        const project = projects[index];
        const isActive = project.id === currentProject.id;
        const targetColor = new THREE.Color(isActive ? currentProject.color : project.color);
        tower.material.color.lerp(targetColor, 0.04);
        tower.material.emissive.lerp(targetColor, 0.04);
        const lift = isActive ? 1.6 : 1;
        tower.scale.y += (tower.userData.baseScale * lift - tower.scale.y) * 0.07;
        tower.rotation.y += 0.012 * speed;
        tower.userData.crown.position.y =
          -0.52 + tower.scale.y / 2 + Math.sin(elapsed * 2 + index) * 0.08;
      });

      rings.forEach((ring, index) => {
        ring.rotation.z += (0.008 + index * 0.004) * speed;
        ring.material.opacity = currentPower ? 0.68 - index * 0.1 : 0.3 - index * 0.05;
      });

      camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.035;
      camera.position.y += (3.1 + pointer.y * -0.9 - camera.position.y) * 0.035;
      camera.lookAt(0, -0.65, 0);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      disposeObject(world);
      particlesGeometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    };
  }, [projects]);

  return <div className="scene" ref={mountRef} aria-hidden="true" />;
}
