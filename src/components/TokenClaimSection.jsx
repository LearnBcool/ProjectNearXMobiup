import { useState } from "react";
import { ethers } from "ethers";

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
  // Função para realizar o claim dos tokens
  const handleClaimToken = async () => {
    try {
      // Verifica se MetaMask está conectada
      if (!account) {
        alert("Please connect to MetaMask first.");
        return;
      }
      // Cria provedor e assinador a partir do MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // Endereço e ABI do contrato
      const contractAddress = "0xb13a636b18758662e7f88c64060a7a43Bd26b76d"; // Substitua pelo endereço real do contrato
      const contractABI = [
        {
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "claim",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      // Instância do contrato
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Valor do claim (100 tokens)
      const to = account; // O próprio usuário
      const amount = ethers.utils.parseUnits("100", 18); // 100 tokens com 18 casas decimais

      // Chama a função claim passando o endereço e valor
      const tx = await contract.claim(to, amount);

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
