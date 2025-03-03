const ConnectPhantomModal = ({ isOpen, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] p-5 rounded-lg w-80 border border-gray-600 text-center shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4">
          Connect Phantom Wallet to bet with SOL
        </h2>
        <button
          onClick={onClose}
          className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ConnectPhantomModal;
