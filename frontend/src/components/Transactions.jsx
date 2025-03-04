import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Clipboard } from "lucide-react"; // Icon for the copy button

const Transactions = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the last message whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to copy text to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy."));
  };

  return (
    <div style={{ backgroundColor: "#1E1E1E" }} className="text-white w-112 text-black rounded-lg p-6 mt-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="h-72 w-full overflow-y-auto scrollbar-hidden">
        <div className="space-y-2 p-2">
          {messages.map((transaction, index) => {
            // Determine background color based on message content
            const bgColor = transaction.includes("Lost") ? "bg-red-600" :
              transaction.includes("Won") ? "bg-green-600" :
                transaction.includes("Added") ? "bg-yellow-700" : "bg-gray-600"; // Default color

            const containsSeed = transaction.toLowerCase().includes("seed"); // Check if message contains "seed"

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`${bgColor} text-white p-4 rounded whitespace-pre-wrap break-words relative`}
              >
                {/* Copy Button (Positioned at Top-Left if "seed" is in the Message) */}
                {containsSeed && (
                  <button
                    onClick={() => handleCopy(transaction)}
                    className="absolute top-1 right-1 p-1 bg-gray-800 hover:bg-gray-700 transition text-white rounded-md"
                    title="Copy to clipboard"
                  >
                    <Clipboard size={18} />
                  </button>
                )}

                {/* Transaction Text */}
                <span>{transaction}</span>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
