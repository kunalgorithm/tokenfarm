pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {

    // state variables are stored on the blockchain
    string public name = "DApp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;
    mapping( address => uint ) public stakingBalance;
    mapping( address => uint ) public rewardBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stake Tokens (Deposit) - where an investor deposits DAI to start earning Dapp rewards 
    function stakeTokens(uint _amount) public {

        require (_amount > 0, "amount staked must be greater than 0");

        // Transfer mock Dai tokens to this contract for staking .
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update staking stakingBalance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // add people if they haven't staked so we can issue them rewards later 
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender); 
        }

        // Update staking status 
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;

    }


    // 2. Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require (balance > 0, "balance must be greater than 0");

        daiToken.transfer(msg.sender, balance);

        // update  stakingBalance
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // 3. Issuing Tokens (Earning Interest)
    function issueTokens() public {
        require(msg.sender == owner, "caller must be the owner");

        // loop through stakers and issue tokens 
        for (uint i=0; i < stakers.length; i++ ) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];

            // Transfer dapp to the staker 
            if (balance > 0 ) {
              dappToken.transfer(recipient, balance);
            }
        }
    }


}