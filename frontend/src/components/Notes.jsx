const Notes = () => {
  return (
    <div className="rounded-lg mt-10 p-10 bg-[#1E1E1E]">
      <h2 className="text-3xl text-center font-bold text-white mb-6">Important Note</h2>
      <ul className="space-y-4">
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">Phantom Wallet Testnet Ready</span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">Provably Fair Game System</span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">Roll Verification via Hash Matching</span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">Bet with SOL</span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">Play with In-Game Dollars</span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">Purchase In-Game Dollars</span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">
            Separate Leaderboards for SOL & In-Game Dollars
          </span>
        </li>
        <li className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
          <span className="text-lg text-gray-300">
            Real-Time Phantom Wallet Balance
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Notes;
