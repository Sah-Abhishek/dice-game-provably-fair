import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddMoneyModal = ({ getUserDetails, setBalance, isOpen, onClose }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [presetAmounts, setPresetAmounts] = useState([
    { id: 1, value: '$5', selected: 'false' },
    { id: 2, value: '$10', selected: 'false' },
    { id: 3, value: '$20', selected: 'false' },
    { id: 4, value: '$50', selected: 'false' },
    { id: 5, value: '$100', selected: 'false' },
    { id: 6, value: '$200', selected: 'false' },
  ]);

  const uuid = localStorage.getItem("uuid");
  const baseUrl = import.meta.env.VITE_BACK_URL;

  const toggleSelected = (id) => {
    setPresetAmounts((prevAmounts) =>
      prevAmounts.map((amount) =>
        amount.id === id
          ? { ...amount, selected: amount.selected === 'false' ? 'true' : 'false' }
          : { ...amount, selected: 'false' } // Deselect others
      )
    );
  };

  const handleAddMoney = async () => {
    const selectedAmount = presetAmounts.find(amount => amount.selected === 'true');
    const amountToAdd = selectedAmount ? selectedAmount.value.replace('$', '') : customAmount;

    if (!amountToAdd) {  // Fix: Check if no amount is selected
      toast.error("Enter a valid Amount");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/add-balance`, {
        uuid,
        increaseRequest: amountToAdd,
      });
      if (response && response.data) {
        setBalance(response.data.balance);
        toast.success(response.data.message);
        getUserDetails();
        onClose(false);
      }
    } catch (error) {
      console.log("There was some error: ", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };
  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] p-6 rounded-lg w-80 relative border border-gray-700 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-1 right-2 text-gray-400 hover:text-gray-200 text-4xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-6 text-center text-white">Add Money</h2>

        {/* Preset Amounts */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {presetAmounts.map((amount) => (
            <button
              key={amount.id}
              className={`border border-gray-600 rounded-md py-2 px-4 text-center text-white transition ${amount.selected === 'true' ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              onClick={() => toggleSelected(amount.id)}
            >
              {amount.value}
            </button>
          ))}
        </div>

        {/* Custom Input Button */}
        <div className="mb-4">
          <button
            onClick={() => setIsInputVisible(true)}
            className="w-full border border-gray-600 bg-gray-800 text-white rounded-md py-2 px-4 text-center hover:bg-gray-700 transition"
          >
            Custom
          </button>
        </div>

        {/* Custom Input Field */}
        {isInputVisible && (
          <div className="mb-6">
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full border border-gray-600 bg-gray-900 text-white rounded-md py-2 px-4 text-center"
              placeholder="Enter amount"
            />
          </div>
        )}

        {/* Add Money Button */}
        <button
          onClick={handleAddMoney}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Add Money
        </button>
      </div>
    </div>
  );
};

export default AddMoneyModal;
