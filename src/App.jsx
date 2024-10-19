import { useState } from 'react';
import Header from './components/Header';
import TransactionSpace from './components/TransactionSpace';
import TokenClaimSection from './components/TokenClaimSection';
import Footer from './components/Footer';

function App() {
  const [transactions, setTransactions] = useState([]);
  
  const handleNewTransaction = (newTransaction) => {
    console.log('New transaction added:', newTransaction); // Para depuração
    setTransactions((prev) => [...prev, newTransaction]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Passa as transações e a função para lidar com novas transações */}
        <TransactionSpace transactions={transactions} />
        <TokenClaimSection onNewTransaction={handleNewTransaction} />
      </main>
      <Footer />
    </div>
  );
}

export default App;

