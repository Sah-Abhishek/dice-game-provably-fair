import { useEffect, useState } from "react";
import Dice from "../components/Dice";
import Profile from "../components/Profile";
import Transactions from "../components/Transactions";
import axios from "axios";
import toast from 'react-hot-toast';
import Leaderboard from "../components/LeaderBoard";
import { Connection, SystemProgram, PublicKey, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import SelectCurrency from "../components/SelectCurrency";
import { Buffer } from 'buffer';
import AddMoneyModal from "../components/AddMoneyModal";
import ConnectPhantomModal from "../components/ConnectPhantomModal";
import { genrateClientSeed } from "../components/functions";
import { VerifiedIcon } from "lucide-react";
import VerifyRollModal from "../components/VerifyRollModal";
import NetworkSelector from "../components/NetworkSelector";
import Rules from "../components/Rules";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const PlayingArea = () => {
  const [bet, setBet] = useState(0.1);
  const [roll, setRoll] = useState(null);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [messages, setMessages] = useState([]);
  const uuid = localStorage.getItem('uuid');
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [phantomBalance, setPhantomBalance] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isConnectPhantomModalOpen, setIsConnectPhantomModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BACK_URL;
  const [clientSeed, setClientSeed] = useState(null);
  const [isVerifyRollModalOpen, setIsVerifyRollOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("devnet"); // Default to devnet


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

    let connection;
    // console.log("This is the publicKey inside the fetchBalance: ", new PublicKey(publicKey));

    if (selectedNetwork === 'devnet') {
      connection = new Connection("https://api.devnet.solana.com", "confirmed");
    } else {
      connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    }

    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      setPhantomBalance(balance / LAMPORTS_PER_SOL);
      // console.log("This is the balance: ", balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.log("There was some error while fetching the balance: ", error);
      toast.error("Error while fetching balance");
    }
  }

  const rollWithSolana = async () => {
    if (!publicKey || bet <= 0) {
      toast.error("Please connect your Phantom wallet and enter a valid bet amount");
      return;
    }

    setLoading(true);
    let connection;

    if (selectedNetwork === 'devnet') {
      connection = new Connection("https://api.devnet.solana.com", "confirmed");
    } else {
      connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    }



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


      const resolveResponse = await axios.post(`${baseUrl}/bet-solana`, {
        selectedNetwork,
        uuid,
        betAmount: bet,
        clientSeed,
        playerPublicKey: publicKey,
      });

      if (!resolveResponse.data.transaction) {
        throw new Error("Backend did not return a valid transaction.");
      }

      const { transaction: serializedTransaction, roll, isWin, serverSeed } = resolveResponse.data;

      setRoll(roll);
      getUserDetails();
      if (isWin) {
        toast.success(`You win ${bet * 2} SOL!`);
      } else {
        toast.error(`You lose ${bet} SOL`);
      }

      window.Buffer = window.Buffer || require("buffer").Buffer;




    } catch (error) {
      console.error("There was some error while betting with Solana:", error);
      if (error.message.includes("User rejected") || error.message.includes("Transaction rejected")) {
        toast.error("Transaction signing was cancelled.");
      } else {
        toast.error("Some error occurred.");
      }
      // toast.error("Some error occurred");
    } finally {
      setLoading(false);
    }
  };


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
    // const clientSeed = Math.random().toString(36).substring(2, 10);
    try {
      const response = await axios.post(`${baseUrl}/roll-dice`, {
        bet, clientSeed, uuid
      });
      if (response.status !== 200) {
        toast.error(response.data.message);
        return;
      }

      const roll = response.data.roll;

      console.log("This is response.data.roll: ", response.data.roll);
      if (response.data.roll > 3) {
        toast.success(`You win $${bet * 2}!`);
      } else {
        toast.error(`You lose $${bet}`);
      }

      setTimeout(() => {
        setBalance(response.data.balance);
        setMessages(response.data.messages);
      }, 1000);
      console.log("This is the roll in next line", response.data.roll);
      setRoll(roll);
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
      const response = await axios.get(`${baseUrl}/user-details/${uuid}`);
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
    setBet(selectedCurrency === "SOL" ? 0.1 : 100);
  }, [selectedCurrency]);

  useEffect(() => {
    let seed = genrateClientSeed();
    setClientSeed(seed);
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [roll]);

  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [selectedNetwork])

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white p-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <NetworkSelector selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} />
        <div className="flex gap-x-4">
          <button
            onClick={() => setIsVerifyRollOpen(true)}
            className="bg-orange-400 hover:bg-orange-500 px-4 py-2 text-white font-bold rounded-lg"
          >
            Verify Bet
          </button>

          <button
            onClick={() => setIsAddMoneyModalOpen(true)}
            className="bg-orange-400 hover:bg-orange-500 px-4 py-2 text-white font-bold rounded-lg"
          >
            Add Money
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col sm:flex-row gap-x-6">
        {/* Left Section */}
        <div className="sm:w-1/4 flex flex-col gap-y-4">
          <SelectCurrency
            setIsAddMoneyModalOpen={setIsAddMoneyModalOpen}
            setIsConnectPhantomModalOpen={setIsConnectPhantomModalOpen}
            walletConnected={walletConnected}
            phantomBalance={phantomBalance}
            balance={balance}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
          <Transactions messages={messages} />
        </div>

        {/* Middle Section */}
        <div className="sm:w-1/2 flex flex-col items-center gap-y-6">
          <Rules />
          <Dice roll={roll} rollDice={rollDice} />
          <div className="flex flex-col items-center">
            <label htmlFor="bet" className="text-lg font-bold">
              Enter bet
            </label>
            <div className="flex items-center mt-2">
              <button
                onClick={() =>
                  setBet((prev) => {
                    const newBet = selectedCurrency === "SOL" ? Math.max(0.01, prev - 0.1) : Math.max(100, prev - 100);
                    return parseFloat(newBet.toFixed(2));
                  })
                }
                className="text-xl font-bold bg-red-500 px-5 py-2 mr-3 rounded-lg"
              >
                -
              </button>

              <input
                id="bet"
                type="number"
                value={bet}
                onChange={(e) => {
                  let value = parseFloat(e.target.value) || 0;
                  if (selectedCurrency === "SOL") {
                    value = Math.max(0.01, value);
                  }
                  setBet(value);
                }}
                className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-40 text-center"
              />

              <button
                onClick={() =>
                  setBet((prev) => {
                    const newBet = selectedCurrency === "SOL" ? prev + 0.1 : prev + 100;
                    return parseFloat(newBet.toFixed(2));
                  })
                }
                className="text-xl font-bold bg-green-500 px-5 py-2 ml-3 rounded-lg"
              >
                +
              </button>
            </div>
          </div>
          <button
            className="mt-6 px-8 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-500"
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

          <div>
            Client Seed: {clientSeed}
          </div>
        </div>

        {/* Right Section */}
        <div className="sm:w-1/4">
          <Leaderboard roll={roll} selectedCurrency={selectedCurrency} />
        </div>
      </div>

      {/* Modals */}
      {isAddMoneyModalOpen && <AddMoneyModal getUserDetails={getUserDetails} setBalance={setBalance} isOpen={isAddMoneyModalOpen} onClose={() => setIsAddMoneyModalOpen(false)} />}
      {isConnectPhantomModalOpen && <ConnectPhantomModal isOpen={isConnectPhantomModalOpen} onClose={() => setIsConnectPhantomModalOpen(false)} />}
      <VerifyRollModal isOpen={isVerifyRollModalOpen} onClose={() => setIsVerifyRollOpen(false)} />
    </div>
  );
};

export default PlayingArea;
