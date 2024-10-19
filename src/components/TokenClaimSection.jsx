import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types'; // Importa PropTypes
import ContractData from './abis/ContractData.json';

const TokenClaimSection = ({ onNewTransaction }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum && !account) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, [account]);

  const connectToMetaMask = async () => {
    try {
      if (provider) {
        setIsConnecting(true);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setIsConnecting(false);
      } else {
        alert('MetaMask not found. Please install it.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setIsConnecting(false);
    }
  };

  const handleClaimToken = async () => {
    try {
      if (!account) {
        alert('Please connect to MetaMask first.');
        return;
      }

      const signer = await provider.getSigner();
      const contractAddress = ContractData.contractAddress;
      const contractABI = ContractData.abi;

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const amountToClaim = ethers.parseUnits('100', 18);
      const tx = await contract.claim(account, amountToClaim);

      
      // Aguarda a confirmação da transação
      const receipt = await tx.wait();
      const txHash = receipt.transactionHash;

      console.log('Transaction Hash:', txHash); // Para depuração

      // Notifica o componente pai sobre a nova transação
      onNewTransaction({
        hash: txHash,
        shortAddress: account.slice(0, 7),
      });
      
    } catch (error) {
      console.error('Error claiming tokens:', error);
      if (error.code === 4001) {
        alert('Transaction rejected by the user.');
      } else {
        alert('Failed to claim tokens.');
      }
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={account ? handleClaimToken : connectToMetaMask}
        disabled={isConnecting}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {isConnecting
          ? 'Connecting...'
          : account
          ? 'Claim 100 FNY Tokens'
          : 'Connect to MetaMask'}
      </button>
    </div>
  );
};

// Validação de props com PropTypes
TokenClaimSection.propTypes = {
  onNewTransaction: PropTypes.func.isRequired,
};

export default TokenClaimSection;
