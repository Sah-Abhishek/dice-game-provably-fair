import { useEffect, useState } from "react";
import Dice from "../components/Dice";
import Profile from "../components/Profile";
import Transactions from "../components/Transactions";
import axios from "axios";
import toast from 'react-hot-toast';
import Leaderboard from "../components/LeaderBoard";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import SelectCurrency from "../components/SelectCurrency";

const PlayingArea = () => {
  const [bet, setBet] = useState(100);
  const [roll, setRoll] = useState(null);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [messages, setMessages] = useState([]);
  const uuid = localStorage.getItem('uuid');
  const [wallletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [phantomBalance, setPhantomBalance] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");


  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect();
        setPublicKey(response.publicKey.toString());
        setWalletConnected(true);

        fetchBalance(response.publicKey);

      } catch (error) {
        console.log("User rejected connection request: ", error);
      }
    }
  }


  const fetchBalance = async (publicKey) => {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      setPhantomBalance(balance / LAMPORTS_PER_SOL);
      console.log("This is the balance: ", balance / LAMPORTS_PER_SOL);
    } catch {
      console.log("There was some error while fetching the balance: ", error);
      toast.error("Error while fetching balance");
    }
  }

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      toast.success("Phantom Wallet Detected");
      connectWallet();
    } else {
      toast.error("Phantom Wallet not detected, Please install phantom");
    }
  }, [])

  const rollDice = async () => {
    setLoading(true);
    const clientSeed = Math.random().toString(36).substring(2, 10);
    try {
      const response = await axios.post("http://localhost:3000/roll-dice", {
        bet, clientSeed, uuid
      });
      if (response.status !== 200) {
        toast.error(response.data.message);
        return;
      }

      setTimeout(() => {
        setBalance(response.data.balance);
        setMessages(response.data.messages);
      }, 1000);
      setRoll(response.data.roll);
      setHash(response.data.hash);
      localStorage.setItem("balance", response.data.balance);
      console.log("The balance is: ", response.data.balance);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("There was some error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user-details/${uuid}`);
      if (response && response.data) {
        localStorage.setItem("balance", response.data.balance);
        setBalance(response.data.balance);
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.log("There was some error while fetching userDetails: ", error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    console.log("These are the messages: ", messages);
  }, [messages]);

  return (
    <div className="relative flex-col h-screen bg-[#121212] text-white flex items-center justify-center">
      {/* Top-Left Profile with Padding */}
      <div>
        <SelectCurrency selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
      </div>
      <div className="absolute top-5 left-5 p-4">
        <Profile walletConnected={wallletConnected} phantomBalance={phantomBalance} getUserDetails={getUserDetails} setBalance={setBalance} balance={balance} />
      </div>

      <div className="absolute bottom-5 left-5 p-4">
        <Transactions messages={messages} />
      </div>

      {/* Centered Dice */}
      <div className="flex justify-center flex-col items-center">
        <Dice roll={roll} rollDice={rollDice} />
        <div className="flex flex-col items-center mt-10">
          <label htmlFor="bet" className="mr-2 font-bold px-6">Enter bet</label>
          <div className="flex items-center">
            <button
              onClick={() => setBet(prev => prev + 100)}
              className="text-xl font-extrabold bg-red-500 px-5 py-2 mr-5 rounded-lg"
            >
              +
            </button>
            <input
              id="bet"
              type="number"
              value={bet}
              onChange={(e) => setBet(Math.max(0, e.target.value))}
              className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-52 text-center"
            />
            <button
              onClick={() => setBet(prev => Math.max(0, prev - 100))}
              className="text-xl font-extrabold bg-green-500 px-5 py-2 ml-5 rounded-lg"
            >
              -
            </button>
          </div>
        </div>
        <button
          className="mt-8 px-10 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-500"
          onClick={rollDice}
          disabled={loading}
        >
          {loading ? "Rolling..." : "Roll Dice"}
        </button>
      </div>

      {/* Right Side - Leaderboard */}
      <div className="absolute right-5 top-10 ">
        <Leaderboard />
      </div>
    </div>
  );
};

export default PlayingArea;
