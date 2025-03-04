import { useEffect, useState } from "react";

const VerifyRollModal = ({ isOpen, onClose }) => {
  const [pastedText, setPastedText] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  // Function to extract values from pasted text
  const extractValues = (text) => {
    const clientSeedMatch = text.match(/clientSeed:\s*(\S+)/);
    const serverSeedMatch = text.match(/serverSeed:\s*(\S+)/);
    const rollHashMatch = text.match(/rollHash:\s*(\S+)/);
    const rollMatch = text.match(/roll:\s*(\d+)/);

    return {
      clientSeed: clientSeedMatch ? clientSeedMatch[1] : null,
      serverSeed: serverSeedMatch ? serverSeedMatch[1] : null,
      rollHash: rollHashMatch ? rollHashMatch[1] : null,
      roll: rollMatch ? parseInt(rollMatch[1], 10) : null,
    };
  };

  // Function to calculate roll from hash
  const calculateRoll = (hash) => {
    if (!hash) return null;
    return (parseInt(hash.substring(0, 8), 16) % 6) + 1;
  };

  // Function to verify roll
  const verifyRoll = () => {
    const { rollHash, roll } = extractValues(pastedText);

    if (!rollHash || roll === null) {
      setVerificationResult("Invalid input ❌");
      return;
    }

    const recalculatedRoll = calculateRoll(rollHash);
    if (recalculatedRoll === roll) {
      setVerificationResult("Valid ✅");
    } else {
      setVerificationResult("Invalid ❌");
    }
  };
  useEffect(() => {
    setPastedText();
    setVerificationResult();

  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-xl font-bold  text-white">Verify Roll</h2>
        <h2 className="mb-4">Paste the bet details here</h2>
        {/* Textarea for pasting rollMessage */}
        <textarea
          value={pastedText}
          spellCheck={false}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste the copied text here..."
          className="w-full h-48 p-2 border border-gray-700 rounded-md resize-none bg-gray-800 text-white"
        ></textarea>

        {/* Verification Result */}
        {verificationResult && (
          <p className={`mt-4 text-lg font-bold ${verificationResult.includes("Valid") ? "text-green-500" : "text-red-500"}`}>
            {verificationResult}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={verifyRoll}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            Verify
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyRollModal;
