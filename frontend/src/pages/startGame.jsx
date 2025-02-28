import { useState, useEffect } from "react";
import axios from "axios";

const StartGame = () => {
  const [username, setUsername] = useState("");

  const fetchUserName = async () => {
    try {
      const response = await axios.get("http://localhost:3000");
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-[#121212] p-8 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-semibold text-gray-200">Welcome,</h1>
        <p className="text-lg text-gray-400 mt-2">
          @{username ? username : "Loading..."}
        </p>

        <button className="mt-6 w-full text-4xl font-black bg-orange-600 hover:bg-orange-500	 text-white font-medium py-2 rounded-lg transition duration-300">
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartGame;
