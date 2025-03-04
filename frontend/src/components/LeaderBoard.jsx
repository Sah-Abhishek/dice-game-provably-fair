import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const backUrl = import.meta.env.VITE_BACK_URL;

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${backUrl}/get-leader-board`);
      setUsers(response.data.users);
      // console.log(response.data.users);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ backgroundColor: '#1E1E1E' }} className="text-white p-5 m-10 mt-20 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 p-4">Username</th>
              <th className="border border-gray-700 p-4">Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="border border-gray-700 p-4">{user.username}</td>
                <td className="border border-gray-700 p-4">{user.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
