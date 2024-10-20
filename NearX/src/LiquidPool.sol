// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SeedFlow.sol"; // Importando o contrato SeedFlow
import "./LiquidYield.sol"; // importando o contrato LiquidYield
import "./Governance.sol"; // Importando o contrato Governance
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract LiquidPool is Ownable {
    using SafeERC20 for SeedFlow;
    using SafeERC20 for LiquidYield;

    SeedFlow public seedFlowToken;
    LiquidYield public liquidYieldToken;
    Governance public governanceContract; // Referência ao contrato de Governança

    struct StakeInfo {
        uint256 amountSeedFlow;
        uint256 amountLiquidYield;
        uint256 depositTime;
    }

    mapping(address => StakeInfo) public stakes;

    uint256 public rewardRate = 100; // Taxa de recompensa em LiquidYield (LDY) por cada SeedFlow (FLOW) staked
    uint256 public lockTime = 30 days; // Tempo de bloqueio para retirada

    event Staked(address indexed user, uint256 amountSeedFlow, uint256 amountLiquidYield, uint256 depositTime);
    event Withdrawn(address indexed user, uint256 amountSeedFlow, uint256 amountLiquidYield);
    event RewardClaimed(address indexed user, uint256 rewardAmount);
    event LiquidityWithdrawn(address indexed recipient, uint256 amountSeedFlow, uint256 amountLiquidYield, uint256 proposalId);

    constructor(
        address _seedFlowToken, 
        address _liquidYieldToken, 
        address _governanceContract
    ) {
        seedFlowToken = SeedFlow(_seedFlowToken);
        liquidYieldToken = LiquidYield(_liquidYieldToken);
        governanceContract = Governance(_governanceContract); // Associando o contrato de governança
    }

    // Função para realizar stake de SeedFlow e receber LiquidYield como recompensa
    function stake(uint256 _amountSeedFlow) external {
        require(_amountSeedFlow > 0, "Cannot stake 0 tokens");

        // Transfere SeedFlow do usuário para o pool
        seedFlowToken.safeTransferFrom(msg.sender, address(this), _amountSeedFlow);

        // Calcula a quantidade de LiquidYield que o usuário deve receber com base na taxa de recompensa
        uint256 rewardAmount = _amountSeedFlow * rewardRate;

        // Atualiza o mapeamento de stakes do usuário
        stakes[msg.sender] = StakeInfo({
            amountSeedFlow: _amountSeedFlow,
            amountLiquidYield: rewardAmount,
            depositTime: block.timestamp
        });

        // Mint LiquidYield como recompensa ao usuário
        liquidYieldToken.mint(msg.sender, rewardAmount);

        emit Staked(msg.sender, _amountSeedFlow, rewardAmount, block.timestamp);
    }

    // Função para o usuário retirar seu stake após o tempo de bloqueio
    function withdraw() external {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amountSeedFlow > 0, "No tokens staked");
        require(block.timestamp >= userStake.depositTime + lockTime, "Tokens are still locked");

        uint256 amountSeedFlow = userStake.amountSeedFlow;
        uint256 amountLiquidYield = userStake.amountLiquidYield;

        // Reseta as informações de stake do usuário
        userStake.amountSeedFlow = 0;
        userStake.amountLiquidYield = 0;

        // Transfere de volta os SeedFlow para o usuário
        seedFlowToken.safeTransfer(msg.sender, amountSeedFlow);

        emit Withdrawn(msg.sender, amountSeedFlow, amountLiquidYield);
    }

    // Função para executar a proposta de retirada de liquidez
    function executeLiquidityProposal(uint256 _proposalId, uint256 _amountSeedFlow, address _recipient) external {
        // Verifica se a proposta foi aprovada no contrato de Governança
        Governance.Proposal memory proposal = governanceContract.proposals(_proposalId);
        require(proposal.executed, "Proposal has not been executed or does not exist");

        // Garante que o pool tenha liquidez suficiente para a retirada
        uint256 poolBalance = seedFlowToken.balanceOf(address(this));
        require(poolBalance >= _amountSeedFlow, "Insufficient liquidity in the pool");

        // Transfere os SeedFlow para o endereço de destino (projeto/usuário)
        seedFlowToken.safeTransfer(_recipient, _amountSeedFlow);

        emit LiquidityWithdrawn(_recipient, _amountSeedFlow, proposal.votesFor, _proposalId);
    }

    // Função para o owner ajustar a taxa de recompensa
    function setRewardRate(uint256 _newRate) external onlyOwner {
        rewardRate = _newRate;
    }

    // Função para o owner ajustar o tempo de bloqueio
    function setLockTime(uint256 _newLockTime) external onlyOwner {
        lockTime = _newLockTime;
    }

    // Função para resgatar fundos do pool (somente para o owner)
    function withdrawFunds(address _tokenAddress, uint256 _amount) external onlyOwner {
        IERC20(_tokenAddress).safeTransfer(owner(), _amount);
    }
}