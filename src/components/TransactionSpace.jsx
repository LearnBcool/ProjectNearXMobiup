import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const TransactionSpace = ({ transactions }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth; // Rolagem para o final sempre que novas transações forem adicionadas
    }
  }, [transactions]);

  return (
    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      {Array.isArray(transactions) && transactions.length > 0 ? (
        <div
          ref={scrollRef}
          className="transaction-list flex overflow-x-auto space-x-4"
        >
          {transactions.map(({ hash, shortAddress }, index) => (
            <div
              key={index}
              className="transaction-item text-gray-300 flex-shrink-0"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm mb-1">
                  Claimed by: <span className="font-bold">{shortAddress ? shortAddress : 'Unknown'}</span>
                </span>
                <a
                  href={hash ? `https://amoy.polygonscan.com/tx/${hash}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Tx Hash: {hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : 'N/A'}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No transactions yet...</p>
      )}
    </div>
  );
};

TransactionSpace.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string.isRequired,
      shortAddress: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionSpace;


