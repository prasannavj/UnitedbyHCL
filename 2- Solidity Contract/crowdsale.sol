pragma solidity ^0.4.15;

import './SafeMath.sol';
import './CBACoinPlatform.sol';

contract Ownable {
    
    address public owner;
    
    function Ownable() {
        
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function transferOnwership(address newOwner) onlyOwner {
        
        require(newOwner != address(0));
        owner = newOwner;
    }
    
}


interface Token {
    
    function transfer(address _to,uint256 _value) returns (bool);
    function balanceof(address _owner) constant returns (uint256 balance);
    
    
}


contract Crowdsale is Ownable {
    
    using SafeMath for uint256;
    
    Token token;
    
    uint256 public constant RATE = 2000; // 1 ether = 2000
    uint256 public constant CAP = 15000; // in ether
    uint256 public constant START = 1504594800; // sep 5 2017 8 GMT +1 
    // date to unix time stamp converter.
    uint256 public constant DAYS = 30;// last for 30 days.
    
    bool public initialized = false;
     uint256 public raisedamount = 0;
     bool public goalReaches; 
     
     event BoughtTokens(address indexed to, uint256 value);
     
     
     modifier whenSaleisActive() {
         assert(isActive());
         _;
     }
    
    function Crowdsale(address _tokenAddr) {
        
        require(_tokenAddr !=0);
        token = Token(_tokenAddr);
    }
    
    function initialize(uint256 numTokens) onlyOwner {
        require(initialized == false);
        require(tokenAvailable() == numTokens);
        initialized = true;
        
    }
    
    
    
    function isActive() constant returns (bool) {
        return (
            initialized == true &&
            now >=START &&
            now <= START.add(DAYS * 1 days) &&
            goalReaches == false
            
            );
    }
    
    
    function goalReached() constant returns (bool) {
        
        return(raisedamount >= CAP * 1 ether);
    }
    
    function () payable {
        buyToken();
    }
    
    
    function buyToken() payable whenSaleisActive {
        
        uint256 weiAmount = msg.value;
        uint256 tokens1 = weiAmount.mul(RATE);
        
        //just a event to regsiter in blockchain that the token is bought.
        BoughtTokens(msg.sender,tokens1 );
        
        raisedamount = raisedamount.add(msg.value);
        
        token.transfer(msg.sender,tokens1);
        
        owner.transfer(msg.value);
    }
    
    function tokenAvailable() constant returns (uint256) {
        
        return token.balanceof(this);
        // this is referenc to the current  contract address.
    }
    
    
    
    function destroy() onlyOwner {
        
        uint256 balance = token.balanceof(this);
        assert(balance >0);
        token.transfer(owner,balance);
        
    } 
    
    
    
    
    
    
    
}