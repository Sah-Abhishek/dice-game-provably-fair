const Rules = () => {
  const lose = ["1", "2", "3"];
  const win = ["4", "5", "6"];

  return (
    <div className="p-5 mb-5 bg-[#1E1E1E] rounded-lg px-10">
      <h2 className="text-center font-extrabold text-3xl text-white mb-4">Rules</h2>

      <div className="flex gap-x-10">
        {/* Losing Numbers */}
        <div className="mb-4">
          <h3 className="text-red-500 font-bold text-xl mb-2 text-center">You Lose On:</h3>
          <div className="flex gap-3 border border-white p-2 rounded-lg">
            {lose.map((item, index) => (
              <div key={index} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-center">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Winning Numbers */}
        <div>
          <h3 className="text-green-500 font-bold text-xl mb-2 text-center">You Win On:</h3>
          <div className="flex gap-3 border border-white p-2 rounded-lg">
            {win.map((item, index) => (
              <div key={index} className=" text-black bg-white px-4 py-2 font-bold rounded-lg text-center ">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Rules;
