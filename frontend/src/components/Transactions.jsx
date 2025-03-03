import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Transactions = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the last message whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ backgroundColor: '#1E1E1E' }} className="text-white w-112 text-black rounded-lg p-6 mt-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="h-72 w-full overflow-y-auto scrollbar-hidden">
        <div className="space-y-2 p-2">
          {messages.map((transaction, index) => {
            // Determine background color based on message content
            const bgColor = transaction.includes("Lost") ? "bg-red-600" :
              transaction.includes("Won") ? "bg-green-600" :
                transaction.includes("Added") ? "bg-yellow-700" : "bg-gray-600"; // Default color

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`${bgColor} text-white p-2 rounded`}
              >
                {transaction}
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
