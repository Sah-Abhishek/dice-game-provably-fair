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

  console.log("Addmoneymodal opened: ");
  const uuid = localStorage.getItem("uuid");

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

    try {
      const response = await axios.post("http://localhost:3000/add-balance", {
        uuid, increaseRequest: amountToAdd
      })
      if (response && response.data) {
        console.log("This is not logging: ", response.data.message);
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
    <div className="fixed text-black inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 relative border-2 border-black">
        <button
          onClick={onClose}
          className="absolute -top-1 right-2 text-gray-600 hover:text-gray-900 text-4xl"
        >
          ×
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg -z-10" />

        <h2 className="text-xl font-bold mb-6 text-center">Add money</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {presetAmounts.map((amount) => (
            <button
              key={amount.id}
              className={`border-2 border-black rounded-md py-2 px-4 text-center ${amount.selected === 'true' ? 'bg-black text-white' : ''}`}
              onClick={() => toggleSelected(amount.id)}
            >
              {amount.value}
            </button>
          ))}
        </div>
        <div className="mb-4">
          <button onClick={() => setIsInputVisible(true)} className="w-full border-2 border-black rounded-md py-2 px-4 text-center">
            Custom
          </button>
        </div>

        {isInputVisible && (
          <div className="mb-6">
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full border-2 border-black rounded-md py-2 px-4 text-center"
              placeholder="Enter amount"
            />
          </div>
        )}

        <button onClick={handleAddMoney} className="w-full bg-black text-white font-bold py-2 px-4 rounded-md">
          Add Money
        </button>
      </div>
    </div>
  );
};

export default AddMoneyModal;
