// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquidYield.sol";  // Importando o contrato LiquidYield

contract Governance is Ownable {
    LiquidYield public liquidYieldToken;

    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        uint256 deadline;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public voted; // Verifica se um endereço já votou em uma proposta específica
    uint256 public proposalCount;
    uint256 public quorumPercentage = 10; // Percentual de quorum necessário para validar uma votação
    uint256 public votingDuration = 7 days; // Tempo de duração da votação

    // Evento para criação de proposta
    event ProposalCreated(uint256 indexed id, string description, uint256 deadline);
    // Evento de votação
    event Voted(address indexed voter, uint256 proposalId, bool support, uint256 weight);
    // Evento de execução de proposta
    event ProposalExecuted(uint256 indexed id, bool success);

    constructor(address _liquidYieldToken) {
        liquidYieldToken = LiquidYield(_liquidYieldToken);  // Associando o token LDY ao contrato de governança
    }

    // Função para criar uma nova proposta
    function createProposal(string calldata _description) external onlyOwner {
        uint256 proposalId = proposalCount;
        proposals[proposalId] = Proposal({
            id: proposalId,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false,
            deadline: block.timestamp + votingDuration
        });
        proposalCount++;

        emit ProposalCreated(proposalId, _description, block.timestamp + votingDuration);
    }

    // Função de votação para holders de LiquidYield (LDY)
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.deadline, "Voting period has ended");
        require(!voted[msg.sender][_proposalId], "You have already voted on this proposal");

        uint256 voterBalance = liquidYieldToken.balanceOf(msg.sender);
        require(voterBalance > 0, "You do not hold any LiquidYield tokens");

        if (_support) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }

        voted[msg.sender][_proposalId] = true;

        emit Voted(msg.sender, _proposalId, _support, voterBalance);
    }

    // Função para executar a proposta após o término da votação
    function executeProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.deadline, "Voting period is still active");
        require(!proposal.executed, "Proposal has already been executed");

        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 quorum = (liquidYieldToken.totalSupply() * quorumPercentage) / 100;
        require(totalVotes >= quorum, "Quorum not reached");

        bool success = proposal.votesFor > proposal.votesAgainst;
        proposal.executed = true;

        // Aqui você pode adicionar a lógica para distribuir recursos ou financiar projetos
        // com base na decisão da votação.

        emit ProposalExecuted(_proposalId, success);
    }

    // Função para atualizar o percentual de quorum necessário
    function updateQuorumPercentage(uint256 _quorumPercentage) external onlyOwner {
        require(_quorumPercentage > 0 && _quorumPercentage <= 100, "Invalid quorum percentage");
        quorumPercentage = _quorumPercentage;
    }

    // Função para atualizar a duração de votação
    function updateVotingDuration(uint256 _votingDuration) external onlyOwner {
        require(_votingDuration > 0, "Invalid voting duration");
        votingDuration = _votingDuration;
    }

    // Função para resgatar tokens do contrato
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        liquidYieldToken.transfer(to, amount);
    }
}
