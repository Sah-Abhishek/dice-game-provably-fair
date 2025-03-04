import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';


const Leaderboard = ({ roll, selectedCurrency }) => {
  const [users, setUsers] = useState(null); // Initially null to handle loading state
  const backUrl = import.meta.env.VITE_BACK_URL;

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${backUrl}/get-leader-board`);
      setUsers(response.data); // Store API response directly
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [roll]);

  return (
    <div className="bg-[#1E1E1E] text-white p-5 m-10 mt-20 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-4">Username</th>
              <th className="border border-gray-700 p-4">
                {selectedCurrency === "SOL" ? "Solana Net Won" : "Net won dollars"}
              </th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              selectedCurrency === "SOL"
                ? users.leaderSolana?.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-700">
                    <td className="border border-gray-700 p-4">{user.username}</td>
                    <td className="border border-gray-700 p-4">
                      {(user.solanaNetWon / LAMPORTS_PER_SOL).toFixed(2)} SOL
                    </td>
                  </tr>
                ))
                : users.leaderInGameDollars?.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-700">
                    <td className="border border-gray-700 p-4">{user.username}</td>
                    <td className="border border-gray-700 p-4">
                      ${user.inGameDollarsNetWon?.toFixed(2)}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
