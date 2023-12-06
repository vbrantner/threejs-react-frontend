import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Box from "./Box";
import OwnCanvas from "./OwnCanvas";

function App() {
  return (
    <>
      <div className="p-10">
        {/* <Canvas className="w-[2024px] h-[2024px] absolute top-0 left-0">
          <ambientLight />
          <pointLight position={[15, 10, 30]} />
          <Box position={[0, 0, 0, 10]} />
        </Canvas> */}
        {/* <Container /> */}
        <OwnCanvas />
      </div>
    </>
  );
}

export default App;

function Container() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const move = (dx, dy) => {
    const newX = Math.min(Math.max(position.x + dx, -1000), 0);
    const newY = Math.min(Math.max(position.y + dy, -1000), 0);
    setPosition({ x: newX, y: newY });
  };

  return (
    <div className="relative w-[1024px] h-[1024px]">
      <div
        className="w-[1024px] h-[1024px] overflow-hidden border-2 border-black relative mx-auto mt-5"
        onMouseLeave={() => setPosition({ x: position.x, y: position.y })}
      >
        <div
          className="w-[1024px] h-[1024px] bg-gradient-to-br from-pink-500 to-green-500 absolute top-0 left-0 "
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
          <img
            className="w-[1024px] h-[1024px] pointer-events-none absolute top-0 left-0"
            src={"http://192.168.1.55:8080/stream"}
          />
          <Canvas
            className="w-[1024px] h-[1024px] absolute top-0 left-0"
            camera={{
              aspect: 800 / 600,
              fov: 100,
              near: 0.1,
              far: 1000,
              position: [0, 0, 10],
            }}
          >
            <ambientLight />
            <pointLight position={[0, 0, 0]} />
            <Box position={[0, 0, 0]} />
          </Canvas>
          {/* <Container /> */}
        </div>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => move(0, 50)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Move Up
        </button>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => move(0, -50)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Move Down
        </button>
      </div>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => move(50, 0)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Move Left
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => move(-50, 0)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Move Right
        </button>
      </div>
    </div>
  );
}
