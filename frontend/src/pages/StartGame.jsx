import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notes from "../components/Notes";

const StartGame = () => {
  const [username, setUsername] = useState("");
  const [uuid, setUuid] = useState("");
  const [balance, setBalance] = useState();
  const navigate = useNavigate();
  const backUrl = import.meta.env.VITE_BACK_URL;

  const fetchUserName = async () => {
    try {
      const response = await axios.get(`${backUrl}`);
      setUsername(response.data.username);
      setUuid(response.data.uuid);
      setBalance(response.data.balance);
      console.log("This is after the firstResponse: ", response);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleNewUser = async () => {
    await fetchUserName(); // Fetch new user but don't store in localStorage yet
  };

  const handleStart = async () => {
    if (!username || !uuid) {
      console.error("No username or UUID found.");
      return;
    }

    try {
      const response = await axios.post(`${backUrl}/start-game`, { username, uuid });
      if (response.status === 200) {
        // Store data in localStorage only when starting the game
        localStorage.setItem("username", username);
        localStorage.setItem("uuid", uuid);
        localStorage.setItem("balance", balance);

        navigate("/game");
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUuid = localStorage.getItem("uuid");

    if (storedUsername && storedUuid) {
      setUsername(storedUsername);
      setUuid(storedUuid);
    } else {
      fetchUserName();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-[#121212] mt-10 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-200">Welcome,</h1>
        <p className="text-lg text-gray-400 mt-2">
          {username ? `@${username}` : "Loading..."}
        </p>

        <div>
          <button onClick={handleStart} className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition duration-300 text-lg"
          >
            Start Game
          </button>
          <button onClick={handleNewUser} className="mt-6 w-full bg-orange-800 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition duration-300 text-lg"
          >
            New User
          </button>

        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-6 mb-10 w-full max-w-sm">
        <Notes />
      </div>
    </div>
  );
};

export default StartGame;
