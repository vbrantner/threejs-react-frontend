import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { WebSocket } from "partysocket";
import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const smoothingFactor = "7";

function Model({ url, position, rotationAxes, quaternion }) {
  const meshRef = React.useRef();
  const gltf = useLoader(GLTFLoader, "/untitled.gltf");
  useFrame(() => {
    if (meshRef.current) {
      const x = smoothingFactor * position[0] - 2;
      const y = smoothingFactor * position[1] - 1;
      const z = position[2];
      console.log(x, y, z);

      meshRef.current.position.set(x, y, z);

      // Original quaternion from OpenCV
      const originalQuaternion = new THREE.Quaternion(
        -quaternion[0],
        quaternion[1],
        quaternion[2],
        -quaternion[3]
      );

      // Create a quaternion representing a 90-degree rotation around the x-axis
      const axis = new THREE.Vector3(-1, 0, 0); // x-axis
      const angle = Math.PI / 2; // 90 degrees in radians
      const offsetQuaternion = new THREE.Quaternion().setFromAxisAngle(
        axis,
        angle
      );

      // Apply the offset to the original quaternion
      const correctedQuaternion = originalQuaternion.multiply(offsetQuaternion);

      // Apply the corrected quaternion to the mesh
      meshRef.current.quaternion.copy(correctedQuaternion);
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={60}
      position={[0, 0, 0]}
    />
  );
}
function OwnCanvas() {
  const url = "ws://192.168.4.84:8765";
  const wsRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState("");
  const [roation, setRotation] = React.useState([0, 0, 0]); // [x, y, z
  const [position, setPosition] = React.useState([0, 0, 0]); // [x, y, z
  const [quaternionFromOpenCV, setQuaternionFromOpenCV] = React.useState([
    0, 0, 0, 0,
  ]);

  useEffect(() => {
    const ws = new WebSocket(url);
    console.log("connecting to websocket");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const imageBase64 = data.image;
      // set rotation
      setRotation(data?.translation || [0, 0, 0]);
      setPosition(data?.position || [0, 0, 0]);
      setQuaternionFromOpenCV(data?.quaternion || [0, 0, 0, 0]);
      setImageSrc("data:image/jpeg;base64," + imageBase64);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const positionFromOpenCV = [position[0], position[1], position[2]]; // x, y, z
  const rotationFromOpenCV = { x: roation[0], y: roation[1], z: roation[2] };

  return (
    <div className="relative">
      <div>
        <img
          className="absolute top-0 left-0 w-[800px] h-[600px]"
          src={imageSrc}
          alt="Received from WebSocket"
          width="800"
          height="800"
        />
      </div>
      <div className="border-2 border-green-500 absolute top-0 left-0 w-[800px] h-[600px]">
        <Canvas className="border-2 border-red-500 w-full h-full">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Model
            quaternion={quaternionFromOpenCV}
            url="/path/to/your/model.gltf"
            position={positionFromOpenCV}
            rotationAxes={rotationFromOpenCV}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default OwnCanvas;
