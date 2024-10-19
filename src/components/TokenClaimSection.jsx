import { useState } from "react";
import { ethers } from "ethers";
import ContractData from "./abis/ContractData.json";

const TokenClaimSection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState(null);

  // Função para conectar à MetaMask
  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        setIsConnecting(true);

        // Usar eth_accounts para obter contas
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnecting(false);

        // Garantir que o usuário está na rede correta
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
      // Verifica se MetaMask está conectada
      if (!account) {
        alert("Please connect to MetaMask first.");
        return;
      }

      // Cria provedor e assinador a partir do MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Endereço e ABI do contrato
      const contractAddress = ContractData.contractAddress; // Substitua pelo endereço real do contrato
      const contractABI = ContractData.abi; // Substitua pela ABI do contrato

      // Instância do contrato
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("Connected");
      // Valor do claim (100 tokens)
      const amountToClaim = ethers.parseUnits("100", 18);
      const tx = await contract.claim(account, amountToClaim); // Chama a função claim

      // Aguarda confirmação da transação
      await tx.wait();
      alert("100 FNY tokens claimed successfully!");
    } catch (error) {
      console.error("Error claiming tokens:", error);

      // Feedback de erro detalhado
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
    </div>
  );
};
export default TokenClaimSection;
