import { useFrame, Canvas, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Scene() {
  const gltf = useLoader(GLTFLoader, "/model-transparent.gltf");
  return (
    <primitive object={gltf.scene} scale={0.111} position={[-0.1, 0.2, -0.4]} />
  );
}

function Box(props) {
  const meshRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    document.body.requestPointerLock();
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;

    const rotationSpeed = 0.001; // Adjust as needed
    meshRef.current.rotation.y += e.movementX * rotationSpeed;
    meshRef.current.rotation.x += e.movementY * rotationSpeed;
  };

  const handlePointerUp = () => {
    document.exitPointerLock();
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
    } else {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, [dragging]);

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={2.6}
      onPointerDown={handlePointerDown}
    >
      <Scene />
    </mesh>
  );
}

export default Box;
