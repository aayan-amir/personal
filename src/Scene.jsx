import { useEffect, useRef } from "react";
import * as THREE from "three";

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

function makeLabel(text, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(12, 8, 32, 0.88)";
  context.strokeStyle = "#ffffff";
  context.lineWidth = 8;
  context.roundRect(10, 22, 492, 96, 22);
  context.fill();
  context.stroke();
  context.fillStyle = color;
  context.font = "900 38px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 70, 440);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    }),
  );
  sprite.scale.set(2.25, 0.7, 1);
  return sprite;
}

function makePortal(portal) {
  const group = new THREE.Group();
  group.position.set(portal.x, 0, portal.z);
  group.userData.portalId = portal.id;

  const color = new THREE.Color(portal.color);
  const secondary = new THREE.Color(portal.secondary);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 1.08, 0.2, 48),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.24,
      metalness: 0.25,
    }),
  );
  base.position.y = 0.1;
  base.userData.portalId = portal.id;

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.045, 12, 96),
    new THREE.MeshBasicMaterial({
      color: secondary,
      transparent: true,
      opacity: 0.85,
    }),
  );
  ring.position.y = 0.42;
  ring.rotation.x = Math.PI / 2;
  ring.userData.portalId = portal.id;

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.18, 2.5, 32, 1, true),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    }),
  );
  beam.position.y = 1.35;
  beam.userData.portalId = portal.id;

  const label = makeLabel(portal.title, portal.color);
  label.position.y = 2.28;
  label.userData.portalId = portal.id;

  group.add(base, ring, beam, label);
  group.userData.ring = ring;
  group.userData.beam = beam;
  return group;
}

export default function Scene({
  activePortalId,
  boost,
  onActivate,
  portals,
  travelTarget,
  virtualMove,
}) {
  const mountRef = useRef(null);
  const latestRef = useRef({
    activePortalId,
    boost,
    onActivate,
    travelTarget,
    virtualMove,
  });

  useEffect(() => {
    latestRef.current = {
      activePortalId,
      boost,
      onActivate,
      travelTarget,
      virtualMove,
    };
  }, [activePortalId, boost, onActivate, travelTarget, virtualMove]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101633, 0.045);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      140,
    );
    camera.position.set(0, 8.2, 8.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const keys = new Set();
    const playerTarget = new THREE.Vector3(-0.2, 0, 0.15);
    const world = new THREE.Group();
    scene.add(world);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(8, 96),
      new THREE.MeshStandardMaterial({
        color: 0x17264d,
        emissive: 0x101f44,
        emissiveIntensity: 0.26,
        roughness: 0.48,
        metalness: 0.08,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.name = "floor";
    world.add(floor);

    const grid = new THREE.GridHelper(15.5, 18, 0x19d7ff, 0x334477);
    grid.position.y = 0.012;
    grid.material.transparent = true;
    grid.material.opacity = 0.34;
    world.add(grid);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.035, 12, 180),
      new THREE.MeshBasicMaterial({
        color: 0x19d7ff,
        transparent: true,
        opacity: 0.85,
      }),
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.04;
    world.add(rim);

    const portalGroups = portals.map((portal) => {
      const portalGroup = makePortal(portal);
      world.add(portalGroup);
      return portalGroup;
    });

    const clickable = [floor, ...portalGroups.flatMap((portal) => portal.children)];

    const player = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.72,
        roughness: 0.16,
        metalness: 0.2,
      }),
    );
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.55, 4),
      new THREE.MeshStandardMaterial({
        color: 0xfff36d,
        emissive: 0xff4fd8,
        emissiveIntensity: 0.45,
      }),
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.z = -0.42;

    const aura = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.025, 8, 80),
      new THREE.MeshBasicMaterial({
        color: 0x00ffa8,
        transparent: true,
        opacity: 0.85,
      }),
    );
    aura.rotation.x = Math.PI / 2;
    aura.position.y = -0.18;

    player.add(body, nose, aura);
    player.position.set(-0.2, 0.52, 0.15);
    scene.add(player);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 720;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = ["#19d7ff", "#7c5cff", "#f8d84a", "#14f195"].map(
      (item) => new THREE.Color(item),
    );

    for (let index = 0; index < particleCount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 7 + Math.random() * 10;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.random() * 8 - 1;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const keyLight = new THREE.PointLight(0xf8d84a, 48, 44);
    keyLight.position.set(2, 7, 4);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x19d7ff, 40, 38);
    fillLight.position.set(-4, 3, 6);
    scene.add(fillLight);

    function setTargetFromPortal(portalId) {
      const portal = portals.find((item) => item.id === portalId);
      if (portal) {
        playerTarget.set(portal.x, 0, portal.z);
      }
    }

    function handlePointerDown(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickable, true);
      const hit = hits[0];
      const portalId = hit?.object?.userData?.portalId;
      if (portalId) {
        setTargetFromPortal(portalId);
        latestRef.current.onActivate(portalId);
        return;
      }

      if (hit?.object?.name === "floor") {
        playerTarget.copy(hit.point);
        playerTarget.y = 0;
      }
    }

    function handleKeyDown(event) {
      if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }
      keys.add(event.key.toLowerCase());
    }

    function handleKeyUp(event) {
      keys.delete(event.key.toLowerCase());
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let lastTravelStamp = null;
    let lastPortalId = null;

    function animate() {
      frameId = window.requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.04);
      const elapsed = clock.elapsedTime;
      const { boost: currentBoost, travelTarget, virtualMove } = latestRef.current;

      if (travelTarget && travelTarget.stamp !== lastTravelStamp) {
        lastTravelStamp = travelTarget.stamp;
        playerTarget.set(travelTarget.x, 0, travelTarget.z);
      }

      const input = new THREE.Vector3();
      if (keys.has("w") || keys.has("arrowup") || virtualMove === "up") input.z -= 1;
      if (keys.has("s") || keys.has("arrowdown") || virtualMove === "down") input.z += 1;
      if (keys.has("a") || keys.has("arrowleft") || virtualMove === "left") input.x -= 1;
      if (keys.has("d") || keys.has("arrowright") || virtualMove === "right") input.x += 1;

      const speed = currentBoost || keys.has("shift") ? 5.4 : 3.2;
      if (input.lengthSq() > 0) {
        input.normalize();
        player.position.x += input.x * speed * delta;
        player.position.z += input.z * speed * delta;
        playerTarget.set(player.position.x, 0, player.position.z);
      } else {
        const toTarget = new THREE.Vector3(
          playerTarget.x - player.position.x,
          0,
          playerTarget.z - player.position.z,
        );
        const distance = toTarget.length();
        if (distance > 0.04) {
          toTarget.normalize();
          player.position.x += toTarget.x * Math.min(speed * delta, distance);
          player.position.z += toTarget.z * Math.min(speed * delta, distance);
        }
      }

      const radius = Math.hypot(player.position.x, player.position.z);
      if (radius > 7.35) {
        player.position.x = (player.position.x / radius) * 7.35;
        player.position.z = (player.position.z / radius) * 7.35;
        playerTarget.set(player.position.x, 0, player.position.z);
      }

      if (input.lengthSq() > 0) {
        player.rotation.y = Math.atan2(input.x, input.z);
      } else {
        const movement = new THREE.Vector3(
          playerTarget.x - player.position.x,
          0,
          playerTarget.z - player.position.z,
        );
        if (movement.lengthSq() > 0.002) {
          player.rotation.y = Math.atan2(movement.x, movement.z);
        }
      }

      aura.rotation.z += delta * (currentBoost ? 8 : 4.4);
      player.position.y = 0.52 + Math.sin(elapsed * 5.2) * 0.045;
      particles.rotation.y += delta * 0.07;
      rim.rotation.z += delta * 0.2;

      let nearestPortal = null;
      let nearestDistance = Infinity;
      portals.forEach((portal) => {
        const distance = Math.hypot(player.position.x - portal.x, player.position.z - portal.z);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPortal = portal;
        }
      });

      if (nearestPortal && nearestDistance < 1.55 && nearestPortal.id !== lastPortalId) {
        lastPortalId = nearestPortal.id;
        latestRef.current.onActivate(nearestPortal.id);
      }

      portalGroups.forEach((portalGroup) => {
        const isActive = portalGroup.userData.portalId === latestRef.current.activePortalId;
        const portalDistance = Math.hypot(
          player.position.x - portalGroup.position.x,
          player.position.z - portalGroup.position.z,
        );
        const showLabel = window.innerWidth > 760 && (isActive || portalDistance < 1.9);
        const targetScale = isActive ? 1.2 : 1;
        portalGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        portalGroup.userData.ring.rotation.z += delta * (isActive ? 2.2 : 1.05);
        portalGroup.userData.beam.material.opacity =
          (isActive ? 0.34 : 0.14) + Math.sin(elapsed * 3) * 0.035;
        portalGroup.children.forEach((child) => {
          if (child.isSprite) {
            child.visible = showLabel;
            child.quaternion.copy(camera.quaternion);
          }
        });
      });

      camera.position.x += (player.position.x * 0.46 - camera.position.x) * 0.045;
      camera.position.z += (player.position.z * 0.46 + 8.2 - camera.position.z) * 0.045;
      camera.lookAt(player.position.x, 0, player.position.z);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      disposeObject(world);
      disposeObject(player);
      particlesGeometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    };
  }, [portals]);

  return <div className="scene" ref={mountRef} aria-label="Playable portfolio map" />;
}
