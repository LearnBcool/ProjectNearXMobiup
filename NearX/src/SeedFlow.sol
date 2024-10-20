// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquidYield.sol"; // Importa o contrato de LiquidYield para distribuição de LDY
import "./Governance.sol";  // Importa o contrato de Governance para futuras interações
import "./LiquidPool.sol";  // Importa o contrato de LiquidPool para depositar FLOW

contract SeedFlow is ERC20, Ownable {
    // Instâncias dos contratos LiquidYield, Governance, e LiquidPool
    LiquidYield public liquidYieldToken;
    Governance public governanceContract;
    LiquidPool public liquidPool;

    // Taxa de conversão entre SeedFlow (FLOW) e LiquidYield (LDY)
    uint256 public rate = 1;

    // Evento para monitorar a compra de SeedFlow e distribuição de LiquidYield
    event SeedFlowMintedToPool(address indexed pool, uint256 flowAmount);
    event LiquidYieldDistributed(address indexed recipient, uint256 ldyAmount);

    constructor(address _liquidYieldAddress, address _governanceAddress, address _liquidPoolAddress)
        ERC20("SeedFlow", "FLOW")
        Ownable(msg.sender)
    {
        // Vincula os contratos LiquidYield, Governance, e LiquidPool
        liquidYieldToken = LiquidYield(_liquidYieldAddress);
        governanceContract = Governance(_governanceAddress);
        liquidPool = LiquidPool(_liquidPoolAddress);
    }

    // Função para comprar SeedFlow (FLOW) e receber LiquidYield (LDY)
    // O SeedFlow é mintado para o LiquidPool, enquanto o comprador recebe LDY
    function buySeedFlow(address recipient, uint256 amount) external payable {
        require(msg.value >= amount * 0.00005 ether, "Insufficient payment"); // Define o preço do SeedFlow

        // Minta o SeedFlow para o contrato LiquidPool
        _mint(address(liquidPool), amount);
        emit SeedFlowMintedToPool(address(liquidPool), amount); // Emite evento de mint para o pool

        // Minta e distribua o token LiquidYield (LDY) para o comprador
        uint256 ldyAmount = amount * rate;
        liquidYieldToken.mint(recipient, ldyAmount); // Gera LDY proporcional ao FLOW adquirido
        emit LiquidYieldDistributed(recipient, ldyAmount); // Emite evento de distribuição de LDY
    }

    // Permite ao owner ajustar a taxa de conversão entre FLOW e LDY
    function setRate(uint256 _rate) external onlyOwner {
        rate = _rate;
    }

    // Exemplo de função para interagir com o contrato de Governance
    function delegateVotingPower(address delegatee) external {
        governanceContract.delegate(msg.sender, delegatee);
    }

    // Função para o owner resgatar os fundos ETH pagos na compra de SeedFlow
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

