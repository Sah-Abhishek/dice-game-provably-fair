
const SelectCurrency = ({ selectedCurrency, setSelectedCurrency }) => {
  const currency = [
    "In-game dollars", "SOL"
  ];


  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="bg-[#2D2D2D] w-112 text-white p-12 mb-8 rounded-xl shadow-lg max-w-md mx-auto">
      <p className="font-extrabold text-3xl text-center mb-8">Select Currency</p>

      <div className="flex justify-between items-center space-x-6 mb-8">
        {currency.map((item, index) => (
          <span
            key={index}
            className={`w-full py-4 text-center font-semibold text-lg rounded-full cursor-pointer transition-all duration-300 transform
              ${selectedCurrency === item ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-xl scale-105" :
                "bg-white text-black hover:bg-gray-200 hover:shadow-lg"}`}
            onClick={() => handleCurrencySelect(item)}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Display selected currency */}
      {selectedCurrency && (
        <div className="text-center mt-6">
          <p className="text-lg text-green-400 font-bold">You selected: <span className="text-white">{selectedCurrency}</span></p>
        </div>
      )}
    </div>
  );
};

export default SelectCurrency;
