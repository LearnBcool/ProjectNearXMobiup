/*import React, { useState } from 'react';
import Web3 from 'web3';

const BuyTokens = ({ contract, account }) => {
  const [amount, setAmount] = useState('');
  const [tokenPrice, setTokenPrice] = useState(0.01); // Preço unitário do token (ajuste conforme necessário)

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      // Calcula o valor total da compra em wei
      const totalValue = web3.utils.toWei(String(amount * tokenPrice), 'ether');

      // Chama a função do contrato para comprar os tokens
      await contract.methods.buyTokens(amount).send({ from: account, value: totalValue });

      // Limpa o campo de entrada
      setAmount('');

      // Adicione aqui qualquer lógica para notificar o usuário sobre o sucesso da transação
      alert('Compra realizada com sucesso!');
    } catch (error) {
      console.error(error);
      // Adicione aqui qualquer lógica para lidar com erros, como mostrar uma mensagem de erro ao usuário
      alert('Ocorreu um erro ao realizar a compra.');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={handleChange}
        placeholder="Quantidade de tokens"
      />
      <button onClick={handleSubmit}>Comprar</button>
      <p>Você receberá {amount} tokens B</p>

      {/* Adicione aqui qualquer outra informação relevante, como o valor total da compra */}
   /* </div>
  );
};

export default BuyTokens;*/