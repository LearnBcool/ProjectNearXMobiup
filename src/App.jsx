
import Header from './components/Header';
import TransactionSpace from './components/TransactionSpace';
import NFTSection from './components/NFTSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TransactionSpace />
        <NFTSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
