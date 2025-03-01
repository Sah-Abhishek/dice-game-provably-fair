import { useEffect, useState } from "react";
import Dice from "../components/Dice";
import Profile from "../components/Profile";
import Transactions from "../components/Transactions";
import axios from "axios";
import AddMoneyModal from "../components/AddMoneyModal";

const PlayingArea = () => {
  const [bet, setBet] = useState(100);
  const [roll, setRoll] = useState(null);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [messages, setMessages] = useState([]);
  const uuid = localStorage.getItem('uuid');

  const rollDice = async () => {
    setLoading(true);
    const clientSeed = Math.random().toString(36).substring(2, 10);
    try {
      const response = await axios.post("http://localhost:3000/roll-dice", {
        bet, clientSeed, uuid
      });

      setRoll(response.data.roll);
      setHash(response.data.hash);
      localStorage.setItem("balance", response.data.balance);
    } catch (error) {
      console.log("There was some error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user-details/${uuid}`);
      if (response && response.data) {
        setTimeout(() => {
          setBalance(response.data.balance);
          setMessages(response.data.messages);
        }, 1000);
      }
    } catch (error) {
      console.log("There was some error while fetching userDetails: ", error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [roll]);

  useEffect(() => {
    console.log("These are the messages: ", messages);
  }, [messages]);

  return (
    <div className="relative h-screen bg-[#121212] text-white flex items-center justify-center">
      {/* Top-Left Profile with Padding */}
      <div className="absolute top-5 left-5 p-4">
        <Profile balance={balance} />
      </div>

      <div className="absolute bottom-5 left-5 p-4">
        <Transactions messages={messages} />
      </div>

      {/* Centered Dice */}
      <div className="flex justify-center flex-col items-center">
        <Dice roll={roll} rollDice={rollDice} />
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-col items-center mt-4">
            <label htmlFor="bet" className="mr-2 font-bold px-6">Enter bet</label>
            <input
              id="bet"
              type="number"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="border border-gray-600 bg-gray-800 text-white p-2 rounded"
            />
          </div>
        </div>
        <button
          className="mt-8 px-6 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-500"
          onClick={rollDice}
          disabled={loading}
        >
          {loading ? "Rolling..." : "Roll Dice"}
        </button>
      </div>

    </div>
  );
};

export default PlayingArea;
