const SelectCurrency = ({
  setIsAddMoneyModalOpen,
  walletConnected,
  setIsConnectPhantomModalOpen,
  balance,
  selectedCurrency,
  setSelectedCurrency,
  phantomBalance
}) => {
  const currency = ["In-game-dollars", "SOL"];
  const username = localStorage.getItem("username");

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    // console.log("This is working");
    // console.log("walletConnected: ", walletConnected, "\t currency: ", currency);

    // If user selects SOL and wallet is NOT connected, trigger the modal
    if (currency === "SOL" && !walletConnected) {
      setIsConnectPhantomModalOpen(true);
    }
  };

  return (
    <div className="bg-[#2D2D2D] w-120 max-w-md text-white p-8 rounded-xl shadow-lg mx-auto">
      <div className="font-bold text-xl text-orange-400 text-center mb-5">@{username}</div>
      <p className="font-extrabold text-3xl text-center mb-8">Select Currency</p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {currency.map((item, index) => (
          <span key={index} className="flex flex-col items-center">
            <div
              className={`min-w-[150px] px-6 py-4 text-center font-semibold text-lg rounded-full cursor-pointer transition-all duration-300 transform whitespace-nowrap
              ${selectedCurrency === item
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-xl scale-105"
                  : "bg-white text-black hover:bg-gray-200 hover:shadow-lg"
                }`}
              onClick={() => handleCurrencySelect(item)}
            >
              {item}
            </div>
            <p className="text-md text-gray-300 mt-2">
              Balance: {item === "In-game-dollars" ? `$${balance.toFixed(3)}` : (phantomBalance ? phantomBalance.toFixed(3) + " SOL" : "0.000 SOL")}
            </p>
          </span>
        ))}
      </div>

      <div className="text-center mt-6 min-h-[40px]">
        <p className="text-lg text-green-400 font-bold">
          {selectedCurrency ? (
            <>You selected: <span className="text-white">{selectedCurrency}</span></>
          ) : (
            ""
          )}
        </p>
      </div>
    </div>
  );
};

export default SelectCurrency;
