// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PredictionMarket {
    enum Side {
        Event_X,
        Event_Y
    }
    struct Result {
        Side winner;
        Side loser;
    }
    Result result;
    bool eventFinished;

    mapping(Side => uint256) public bets;
    mapping(address => mapping(Side => uint256)) public betsPerPredictor;
    address public oracle;

    constructor(address _oracle) {
        oracle = _oracle;
    }

    function placeBet(Side _side) external payable {
        require(eventFinished == false, "Event Already Happened");
        bets[_side] += msg.value;
        betsPerPredictor[msg.sender][_side] += msg.value;
    }

    function withdrawGain() external {
        uint256 predictorBet = betsPerPredictor[msg.sender][result.winner];
        require(predictorBet > 0, "You Do Not Have Any Winning Bet");
        require(eventFinished == true, "Event Has Not Happened Yet");
        uint256 gain = predictorBet +
            (bets[result.loser] * predictorBet) /
            bets[result.winner];
        betsPerPredictor[msg.sender][Side.Event_X] = 0;
        betsPerPredictor[msg.sender][Side.Event_Y] = 0;
        payable(msg.sender).transfer(gain);
    }

    function reportResult(Side _winner, Side _loser) external {
        require(oracle == msg.sender, "Only Oracle");
        result.winner = _winner;
        result.loser = _loser;
        eventFinished = true;
    }
}
