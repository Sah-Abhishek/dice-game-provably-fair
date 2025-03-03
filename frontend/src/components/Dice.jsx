import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dice = ({ roll }) => {
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

  console.log("This is the roll from inside of the dice component: ", roll);
  // Trigger the rolling animation and set the result to the `roll` prop
  useEffect(() => {
    if (roll) {
      setRolling(true);
      setTimeout(() => {
        setResult(roll);
        setRolling(false);
      }, 1000); // Animation duration
    }
  }, [roll]);

  return (
    <div>
      {/* Dice Container */}
      <motion.div
        className="w-24 h-24 bg-white text-black rounded-lg shadow-lg flex items-center justify-center text-4xl font-bold relative"
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
        {Object.keys(resultRotations).map((key) => (
          <div
            key={key}
            className="absolute w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-gray-200"
            style={{
              transform:
                key === "1"
                  ? "translateZ(30px)"
                  : key === "2"
                    ? "rotateY(90deg) translateZ(30px)"
                    : key === "3"
                      ? "rotateY(-90deg) translateZ(30px)"
                      : key === "4"
                        ? "rotateX(90deg) translateZ(30px)"
                        : key === "5"
                          ? "rotateX(-90deg) translateZ(30px)"
                          : "rotateY(180deg) translateZ(30px)", // Back face
            }}
          >
            {key}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dice;
