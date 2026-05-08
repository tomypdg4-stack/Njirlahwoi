'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010108, 0.0015);

    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 2000);
    camera.position.z = 120;
    camera.position.y = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    // --- Layer 1: Massive Background Starfield (Deep Space) ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000 - 500;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    // --- Layer 1.5: Cyberpunk Grid Floor ---
    const gridHelper = new THREE.GridHelper(1000, 100, 0x06B6D4, 0x7C3AED);
    gridHelper.position.y = -60;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.15;
    scene.add(gridHelper);
    // --- Layer 2: Glowing Core (Icosahedron/Torus structure) ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner wireframe sphere
    const innerGeo = new THREE.IcosahedronGeometry(30, 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true, transparent: true, opacity: 0.15 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Outer wireframe torus
    const outerGeo = new THREE.TorusGeometry(45, 1.5, 16, 100);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.2 });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerMesh.rotation.x = Math.PI / 2;
    coreGroup.add(outerMesh);

    // Ring 2
    const ringGeo = new THREE.TorusGeometry(55, 0.5, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xF43F5E, wireframe: true, transparent: true, opacity: 0.1 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.y = Math.PI / 4;
    coreGroup.add(ringMesh);

    // --- Layer 3: Neural Network Particles & Lines ---
    const nodeCount = 350;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const palette = [
      new THREE.Color('#7C3AED'), // Neon Violet
      new THREE.Color('#06B6D4'), // Plasma Cyan
      new THREE.Color('#F43F5E'), // Hot Coral
      new THREE.Color('#10B981'), // Matrix Green
      new THREE.Color('#F59E0B')  // Molten Amber
    ];

    for (let i = 0; i < nodeCount; i++) {
      // Create a sprawling network
      nodePositions[i * 3] = (Math.random() - 0.5) * 300;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 150;
      nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 150;

      const color = palette[Math.floor(Math.random() * palette.length)];
      nodeColors[i * 3] = color.r;
      nodeColors[i * 3 + 1] = color.g;
      nodeColors[i * 3 + 2] = color.b;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    // Custom shader material for glowing nodes
    const nodeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(time * 2.0 + position.x * 0.05) * 2.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (12.0 + sin(time * 3.0 + position.z * 0.1) * 4.0) * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float intensity = 1.0 - (dist * 2.0);
          gl_FragColor = vec4(vColor * intensity * 1.5, intensity * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodes);

    // Create lines connecting nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    // Dynamic lines logic
    const linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    scene.add(linesMesh);

    // --- Layer 4: Interactive Floating Elements (Data Packets) ---
    const packetCount = 50;
    const packetGeo = new THREE.OctahedronGeometry(0.8, 0);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true });
    const packetGroup = new THREE.InstancedMesh(packetGeo, packetMat, packetCount);
    
    const dummy = new THREE.Object3D();
    const packetData: { x: number, y: number, z: number, speed: number, radius: number, offset: number }[] = [];
    
    for (let i = 0; i < packetCount; i++) {
      packetData.push({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100,
        speed: 0.01 + Math.random() * 0.02,
        radius: 10 + Math.random() * 40,
        offset: Math.random() * Math.PI * 2
      });
      dummy.position.set(packetData[i].x, packetData[i].y, packetData[i].z);
      dummy.updateMatrix();
      packetGroup.setMatrixAt(i, dummy.matrix);
    }
    scene.add(packetGroup);

    // --- Interaction ---
    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX - windowHalfX) * 0.001;
      mouse.y = (event.clientY - windowHalfY) * 0.001;
    };
    window.addEventListener('mousemove', onDocumentMouseMove, false);

    const handleResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let frame = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera easing
      target.x = mouse.x * 20;
      target.y = mouse.y * 20;
      camera.position.x += (target.x - camera.position.x) * 0.02;
      camera.position.y += (-target.y + 20 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Rotate core
      innerMesh.rotation.y = time * 0.1;
      innerMesh.rotation.x = time * 0.05;
      outerMesh.rotation.z = time * 0.15;
      ringMesh.rotation.x = time * -0.2;

      // Update nodes
      nodeMaterial.uniforms.time.value = time;
      nodes.rotation.y = time * 0.02;

      // Update data packets
      for (let i = 0; i < packetCount; i++) {
        const pd = packetData[i];
        const angle = time * pd.speed + pd.offset;
        dummy.position.set(
          pd.x + Math.cos(angle) * pd.radius,
          pd.y + Math.sin(angle * 2) * (pd.radius * 0.2),
          pd.z + Math.sin(angle) * pd.radius
        );
        dummy.rotation.x += 0.01;
        dummy.rotation.y += 0.02;
        dummy.updateMatrix();
        packetGroup.setMatrixAt(i, dummy.matrix);
      }
      packetGroup.instanceMatrix.needsUpdate = true;
      packetGroup.rotation.y = time * -0.01;

      // Dynamic connections calculation (throttle to save perf)
      if (frame % 3 === 0) {
        const positions = nodeGeometry.attributes.position.array as Float32Array;
        const colors = nodeGeometry.attributes.color.array as Float32Array;
        const linePos = [];
        const lineCol = [];
        
        let connectionCount = 0;
        // Optimization: only check a subset or use a spatial grid in production, 
        // here we check a limited range for visual effect
        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            if (connectionCount > 1500) break; // Limit max lines
            
            const dx = positions[i*3] - positions[j*3];
            const dy = positions[i*3+1] - positions[j*3+1];
            const dz = positions[i*3+2] - positions[j*3+2];
            const distSq = dx*dx + dy*dy + dz*dz;

            if (distSq < 1500) { // Connect if distance is < ~38
              linePos.push(
                positions[i*3], positions[i*3+1], positions[i*3+2],
                positions[j*3], positions[j*3+1], positions[j*3+2]
              );
              
              // Interpolate colors based on distance
              const alpha = 1.0 - (distSq / 1500);
              lineCol.push(
                colors[i*3], colors[i*3+1], colors[i*3+2], alpha * 0.5,
                colors[j*3], colors[j*3+1], colors[j*3+2], alpha * 0.5
              );
              connectionCount++;
            }
          }
        }
        
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        linesMesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 4));
        linesMesh.rotation.y = time * 0.02; // Match nodes rotation
      }

      // Rotate starfield slowly
      stars.rotation.y = time * 0.005;

      // Animate grid moving forward
      gridHelper.position.z = (time * 10) % 10;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
      style={{ background: 'radial-gradient(circle at center, #010108 0%, #000000 100%)' }}
    />
  );
}
