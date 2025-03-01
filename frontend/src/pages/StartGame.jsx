import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StartGame = () => {
  const [username, setUsername] = useState("");
  const [uuid, setUuid] = useState("");
  const [balance, setBalance] = useState();
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const response = await axios.get("http://localhost:3000");
      setUsername(response.data.username);
      setUuid(response.data.uuid);
      setBalance(response.data.uuid);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleStart = async () => {
    try {
      const response = await axios.post("http://localhost:3000/start-game", { username, uuid });
      console.log("This is the response.status: ", response.status);
      if (response.status === 200) {
        localStorage.setItem("username", username);
        localStorage.setItem("uuid", uuid);
        localStorage.setItem("balance", balance);
        navigate('/game');
      }
    } catch (error) {
      console.error("Error starting the game:", error);
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
          {username ? username : "Loading..."}
        </p>

        <button onClick={handleStart} className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 rounded-lg transition duration-300">
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartGame;
