import React, { useState } from "react";
import { motion } from "framer-motion";

const Dice = () => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(1);

  // Map dice results to their respective rotations
  const resultRotations = {
    1: { rotateX: 0, rotateY: 0, rotateZ: 0 }, // Front face
    2: { rotateX: 0, rotateY: 90, rotateZ: 0 }, // Right face
    3: { rotateX: 0, rotateY: -90, rotateZ: 0 }, // Left face
    4: { rotateX: 90, rotateY: 0, rotateZ: 0 }, // Top face
    5: { rotateX: -90, rotateY: 0, rotateZ: 0 }, // Bottom face
    6: { rotateX: 0, rotateY: 180, rotateZ: 0 }, // Back face
  };

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      setResult(randomNumber);
      setRolling(false);
    }, 1000); // Animation duration
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Dice Container */}
      <motion.div
        className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-4xl font-bold relative"
        style={{
          transformStyle: "preserve-3d", // Enable 3D transformations
        }}
        animate={{
          rotateX: rolling ? 1080 : resultRotations[result].rotateX,
          rotateY: rolling ? 720 : resultRotations[result].rotateY,
          rotateZ: rolling ? 360 : resultRotations[result].rotateZ,
        }}
        transition={{
          duration: 1, // Faster animation
          ease: "easeInOut",
        }}
      >
        {/* Dice Faces */}
        <div
          className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
          style={{
            transform: "translateZ(30px)", // Front face
          }}
        >
          1
        </div>
        <div
          className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
          style={{
            transform: "rotateY(90deg) translateZ(30px)", // Right face
          }}
        >
          2
        </div>
        <div
          className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
          style={{
            transform: "rotateY(-90deg) translateZ(30px)", // Left face
          }}
        >
          3
        </div>
        <div
          className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
          style={{
            transform: "rotateX(90deg) translateZ(30px)", // Top face
          }}
        >
          4
        </div>
        <div
          className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
          style={{
            transform: "rotateX(-90deg) translateZ(30px)", // Bottom face
          }}
        >
          5
        </div>
        <div
          className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
          style={{
            transform: "rotateY(180deg) translateZ(30px)", // Back face
          }}
        >
          6
        </div>
      </motion.div>

      {/* Roll Button */}
      <button
        className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        onClick={rollDice}
        disabled={rolling}
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
};

export default Dice;
