import { useState } from "react";
import AddMoneyModal from "./AddMoneyModal";

const Profile = ({ balance }) => {
  const username = localStorage.getItem("username") || "Guest"; // Fallback for null
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);

  return (
    <div className="bg-white border border-black text-black rounded-lg p-6 flex flex-col items-start relative">
      <p className="text-lg font-medium mb-4">@{username}</p>
      <div className="flex items-center mb-4">
        <p className="mr-2">Balance:</p>
        <p className="font-semibold">{balance}</p>
      </div>
      <button
        className="bg-gray-800 text-white py-2 px-4 rounded-md"
        onClick={() => setIsAddMoneyModalOpen(true)}
      >
        Add Money
      </button>

      {/* Modal should be outside Profile's container for better stacking */}
      {isAddMoneyModalOpen && (
        <AddMoneyModal isOpen={isAddMoneyModalOpen} onClose={() => setIsAddMoneyModalOpen(false)} />
      )}
    </div>
  );
};

export default Profile;
