import { useEffect, useState } from "react";
import Dice from "../components/Dice";
import Profile from "../components/Profile";
import Transactions from "../components/Transactions";
import axios from "axios";
import toast from "react-hot-toast";
import Leaderboard from "../components/LeaderBoard";
import {
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import SelectCurrency from "../components/SelectCurrency";
import { Buffer } from "buffer";
import AddMoneyModal from "../components/AddMoneyModal";
import ConnectPhantomModal from "../components/ConnectPhantomModal";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const PlayingArea = () => {
  const [bet, setBet] = useState(0.1);
  const [roll, setRoll] = useState(null);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [messages, setMessages] = useState([]);
  const uuid = localStorage.getItem("uuid");
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [phantomBalance, setPhantomBalance] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isConnectPhantomModalOpen, setIsConnectPhantomModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BACK_URL;

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

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
  };

  const fetchBalance = async (publicKey) => {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      setPhantomBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.log("Error fetching balance: ", error);
      toast.error("Error while fetching balance");
    }
  };

  const rollWithSolana = async () => {
    if (!publicKey || bet <= 0) {
      toast.error("Please connect your Phantom wallet and enter a valid bet amount");
      return;
    }
    setLoading(true);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    try {
      const escrowAccount = new PublicKey("3jvoEz3MUGXMhzrSptSkZMFA5oYXKaMc3eXqs9uk6ZMH");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: escrowAccount,
          lamports: bet * LAMPORTS_PER_SOL,
        })
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(publicKey);

      const signedTransaction = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      const clientSeed = Math.random().toString(36).substring(2);
      const resolveResponse = await axios.post(`${baseUrl}/bet-solana`, {
        uuid,
        betAmount: bet,
        clientSeed,
        playerPublicKey: publicKey,
      });

      if (!resolveResponse.data.transaction) {
        throw new Error("Backend did not return a valid transaction.");
      }

      const { transaction: serializedTransaction, roll, isWin } = resolveResponse.data;
      setRoll(roll);
      getUserDetails();

      if (isWin) {
        toast.success(`You win ${bet * 2} SOL!`);
      } else {
        toast.error(`You lose ${bet} SOL`);
      }

      window.Buffer = window.Buffer || require("buffer").Buffer;
      // Additional processing for backend transaction if needed

    } catch (error) {
      console.error("Error while betting with Solana:", error);
      if (
        error.message.includes("User rejected") ||
        error.message.includes("Transaction rejected")
      ) {
        toast.error("Transaction signing was cancelled.");
      } else {
        toast.error("Some error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const rollDice = async () => {
    setLoading(true);
    const clientSeed = Math.random().toString(36).substring(2, 10);
    try {
      const response = await axios.post(`${baseUrl}/roll-dice`, {
        bet,
        clientSeed,
        uuid,
      });
      if (response.status !== 200) {
        toast.error(response.data.message);
        return;
      }
      const roll = response.data.roll;
      if (roll > 3) {
        toast.success(`You win $${bet * 2}!`);
      } else {
        toast.error(`You lose $${bet}`);
      }
      setTimeout(() => {
        setBalance(response.data.balance);
        setMessages(response.data.messages);
      }, 1000);
      setRoll(roll);
      setHash(response.data.hash);
      localStorage.setItem("balance", response.data.balance);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error rolling dice: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user-details/${uuid}`);
      if (response && response.data) {
        localStorage.setItem("balance", response.data.balance);
        setBalance(response.data.balance);
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.log("Error fetching user details: ", error);
    }
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      toast.success("Phantom Wallet Detected");
      connectWallet();
    } else {
      toast.error("Phantom Wallet not detected, Please install Phantom");
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [roll]);

  return (
    <div className="min-h-screen bg-[#121212] text-white relative">
      {/* Desktop / Laptop Layout */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:h-screen">
        {/* Top-Right Add Money Button */}
        <button
          onClick={() => setIsAddMoneyModalOpen(true)}
          className="absolute top-7 right-20 bg-orange-400 hover:bg-orange-500 px-3 py-2 text-white font-bold text-xl rounded-lg"
        >
          Add Money
        </button>
        {/* Top-Left Currency Selector */}
        <div className="absolute top-5 left-5 p-4">
          <SelectCurrency
            setIsAddMoneyModalOpen={setIsAddMoneyModalOpen}
            setIsConnectPhantomModalOpen={setIsConnectPhantomModalOpen}
            walletConnected={walletConnected}
            phantomBalance={phantomBalance}
            balance={balance}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </div>
        {/* Bottom-Left Transactions */}
        <div className="absolute bottom-5 left-5 p-4">
          <Transactions messages={messages} />
        </div>
        {/* Right-Side Leaderboard */}
        <div className="absolute right-5 top-20">
          <Leaderboard />
        </div>
        {/* Centered Dice and Bet Controls */}
        <div className="flex flex-col items-center">
          <Dice roll={roll} rollDice={rollDice} />
          <div className="flex flex-col items-center mt-10">
            <label htmlFor="bet" className="mr-2 font-bold px-6">
              Enter bet
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setBet((prev) => prev + 100)}
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
                onClick={() => setBet((prev) => Math.max(0, prev - 100))}
                className="text-xl font-extrabold bg-green-500 px-5 py-2 ml-5 rounded-lg"
              >
                -
              </button>
            </div>
          </div>
          <button
            className="mt-8 px-10 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-500"
            onClick={() => {
              if (selectedCurrency === "In-game-dollars") {
                rollDice();
              } else if (selectedCurrency === "SOL") {
                rollWithSolana();
              } else {
                toast.error("Select a currency");
              }
            }}
            disabled={loading}
          >
            {loading ? "Rolling..." : "Roll Dice"}
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <SelectCurrency
            setIsAddMoneyModalOpen={setIsAddMoneyModalOpen}
            setIsConnectPhantomModalOpen={setIsConnectPhantomModalOpen}
            walletConnected={walletConnected}
            phantomBalance={phantomBalance}
            balance={balance}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
          <button
            onClick={() => setIsAddMoneyModalOpen(true)}
            className="bg-orange-400 hover:bg-orange-500 px-3 py-2 text-white font-bold text-lg rounded-lg"
          >
            Add Money
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center flex-grow px-4">
          <Dice roll={roll} rollDice={rollDice} />
          <div className="flex flex-col items-center mt-10">
            <label htmlFor="bet" className="mr-2 font-bold px-6">
              Enter bet
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setBet((prev) => prev + 100)}
                className="text-xl font-extrabold bg-red-500 px-5 py-2 mr-5 rounded-lg"
              >
                +
              </button>
              <input
                id="bet"
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(0, e.target.value))}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-28 text-center"
              />
              <button
                onClick={() => setBet((prev) => Math.max(0, prev - 100))}
                className="text-xl font-extrabold bg-green-500 px-5 py-2 ml-5 rounded-lg"
              >
                -
              </button>
            </div>
          </div>
          <button
            className="mt-8 px-10 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-500"
            onClick={() => {
              if (selectedCurrency === "In-game-dollars") {
                rollDice();
              } else if (selectedCurrency === "SOL") {
                rollWithSolana();
              } else {
                toast.error("Select a currency");
              }
            }}
            disabled={loading}
          >
            {loading ? "Rolling..." : "Roll Dice"}
          </button>
        </main>

        {/* Footer */}
        <footer className="p-4">
          <Transactions messages={messages} />
          <Leaderboard />
        </footer>
      </div>

      {/* Modals */}
      {isAddMoneyModalOpen && (
        <AddMoneyModal
          getUserDetails={getUserDetails}
          setBalance={setBalance}
          isOpen={isAddMoneyModalOpen}
          onClose={() => setIsAddMoneyModalOpen(false)}
        />
      )}
      {isConnectPhantomModalOpen && (
        <ConnectPhantomModal
          isOpen={isConnectPhantomModalOpen}
          onClose={() => setIsConnectPhantomModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PlayingArea;
