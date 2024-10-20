// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidYield is ERC20, Ownable {
    // Somente o contrato SeedFlow poderá mintar novos tokens LDY
    address public seedFlowContract;

    // Evento para monitorar a alteração do contrato SeedFlow autorizado
    event SeedFlowContractSet(address indexed newSeedFlowContract);

    constructor() ERC20("LiquidYield", "LDY") {}

    // Define o endereço do contrato SeedFlow que pode mintar LDY
    function setSeedFlowContract(address _seedFlowContract) external onlyOwner {
        require(_seedFlowContract != address(0), "Invalid SeedFlow contract address");
        seedFlowContract = _seedFlowContract;
        emit SeedFlowContractSet(_seedFlowContract); // Emite evento quando SeedFlow é configurado
    }

    // Função de mintagem que só pode ser chamada pelo contrato SeedFlow
    function mint(address to, uint256 amount) external {
        require(msg.sender == seedFlowContract, "Only SeedFlow contract can mint LiquidYield tokens");
        _mint(to, amount);
    }

    // Função para o owner resgatar tokens LDY, se necessário (ex. para uma pool de liquidez)
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        _transfer(address(this), to, amount);
    }
}
