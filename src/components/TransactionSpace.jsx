import PropTypes from 'prop-types';

const TransactionSpace = ({ transactions }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      {transactions && transactions.length > 0 ? (
        <div className="transaction-list flex overflow-x-auto space-x-4">
          {transactions.map(({ hash, shortAddress }, index) => (
            <div key={index} className="transaction-item text-gray-300 flex-shrink-0">
              <a 
                href={`https://amoy.polygonscan.com/tx/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <span className="mr-2">{shortAddress}</span>
                <span>Tx: {hash.slice(0, 6)}...{hash.slice(-4)}</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No transactions yet...</p>
      )}
    </div>
  );
};

// Validação das props
TransactionSpace.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string.isRequired,
      shortAddress: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionSpace;
