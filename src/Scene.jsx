import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const pointer = new THREE.Vector2();
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(2.2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7be0c3,
      roughness: 0.38,
      metalness: 0.15,
      emissive: 0x0a3028,
      emissiveIntensity: 0.6,
      wireframe: true,
    });
    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 720;
    const positions = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 34;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 24;
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xf6f0e8,
        size: 0.035,
        transparent: true,
        opacity: 0.72,
      }),
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));

    const keyLight = new THREE.PointLight(0xffcf66, 35, 40);
    keyLight.position.set(6, 4, 8);
    scene.add(keyLight);

    function handlePointerMove(event) {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    }

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    let frameId = 0;
    function animate() {
      frameId = window.requestAnimationFrame(animate);
      group.rotation.x += 0.003;
      group.rotation.y += 0.006;
      group.position.x += (pointer.x * 1.8 - group.position.x) * 0.04;
      group.position.y += (pointer.y * -1.2 - group.position.y) * 0.04;
      stars.rotation.y += 0.0008;
      renderer.render(scene, camera);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
    };
  }, []);

  return <div className="scene" ref={mountRef} aria-hidden="true" />;
}
