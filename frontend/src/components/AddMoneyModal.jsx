const AddMoneyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Money</h2>
        <p>This is the AddMoneyModal</p>
      </div>
    </div>
  );
};

export default AddMoneyModal;
