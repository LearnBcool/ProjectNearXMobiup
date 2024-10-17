import { useState } from 'react';

const NFTSection = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleClaimNFT = async () => {
    setIsConnecting(true);
    // Simulating Metamask connection
    setTimeout(() => {
      setIsConnecting(false);
      alert('Metamask connected! You can now claim your NFT.');
    }, 2000);
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <img
          src="https://source.unsplash.com/random/800x400?nft"
          alt="NFT Preview"
          className="mx-auto rounded-lg shadow-lg"
        />
      </div>
      <button
        onClick={handleClaimNFT}
        disabled={isConnecting}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {isConnecting ? 'Connecting...' : 'Claim NFT'}
      </button>
    </div>
  );
};

export default NFTSection;