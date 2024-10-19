import { useState } from "react";
import { ethers } from "ethers";
import ContractData from "./abis/ContractData.json";
import TransactionSpace from "./TransactionSpace"; // Importe o componente TransactionSpace

const TokenClaimSection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]); // Estado para armazenar transações

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnecting(false);

        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        if (networkId !== "80002") {
          alert("Please connect to the Polygon Amoy Testnet!");
        }
      } else {
        alert("MetaMask not found. Please install it.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setIsConnecting(false);
    }
  };

  const handleClaimToken = async () => {
    try {
      if (!account) {
        alert("Please connect to MetaMask first.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = ContractData.contractAddress; 
      const contractABI = ContractData.abi;

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("Connected");

      const amountToClaim = ethers.parseUnits("100", 18);
      const tx = await contract.claim(account, amountToClaim); 

      // Aguarda a confirmação da transação
      const receipt = await tx.wait();
      const txHash = receipt.transactionHash;

      // Adiciona a transação ao estado (hash e os primeiros 7 dígitos do endereço)
      setTransactions((prev) => [
        ...prev,
        {
          hash: txHash,
          shortAddress: account.slice(0, 7) // Apenas os primeiros 7 dígitos
        }
      ]);

      alert("100 FNY tokens claimed successfully!");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      if (error.code === 4001) {
        alert("Transaction rejected by the user.");
      } else {
        alert("Failed to claim tokens.");
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
          ? "Connecting..."
          : account
          ? "Claim 100 FNY Tokens"
          : "Connect to MetaMask"}
      </button>
      <TransactionSpace transactions={transactions} />
    </div>
  );
};

export default TokenClaimSection;

