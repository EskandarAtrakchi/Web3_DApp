// Connect to BSC using Web3
const web3 = new Web3("https://bsc-dataseed.binance.org/");

// Retrieve the address of the deployed FundFactory contract on the BSC network
const factoryAddress = "0x8CE38aaeb020E6c5fC5782493427894dCc6778A4"; // FundFactory contract address

// FundFactory ABI is imported from './contractsABIs/FundFactoryABI.js';
import contractABI from './contractsABIs/FundFactoryABI.js';

// Create an instance of the FundFactory contract
const factoryContract = new web3.eth.Contract(factoryABI, factoryAddress);

// Function to create a new fund pool
async function createFundPool(event) {

    event.preventDefault();

    //I have committed the values in $ USD in other web3.js files, so it is important to keep it as USD stablecoins.
    //IMPORTANT NOTE: It might be a better idea to keep it as BUSD stablecoin terms and not keep changing with other stablecoins, such as USDT and USD  

    /*
    function createFundPool(address _token, address _team, uint256 _cap, bool _kyc) public onlyOwner{
        address fundPool = address(new AvanzoNFT(marketPlace, _team, _cap, priceFeedAdd, _token, _kyc));
        FundList[runningCount] = fundPool;
        runningCount++;
    }
    */

// Import the AvanzoNFT contract ABI
import avanzoNFTABI from './contractsABIs/avanzoNFTABI.js';

// the address of your AvanzoNFT (NFT_flat.sol) contract
const avanzoNFTAddress = 'AVANZO_NFT_CONTRACT_ADDRESS';

// Create an instance of the AvanzoNFT contract
const avanzoNFTContract = new web3.eth.Contract(avanzoNFTABI, avanzoNFTAddress);

// Listen for the newProposal event
avanzoNFTContract.events.newProposal({
    fromBlock: 0
}, 
async function(error, event) {
    if (error) {
        console.error(error);
        alert.error(error);
    } else {
        const end = document.getElementById('end').value; // The end time of the proposal
        const proposal = document.getElementById('proposalTextField').value; // The text of the proposal
        
        try {
            await avanzoNFTContract.methods.createProposal(end, proposal).send({ from: userAddress });
            
            // Get the proposal text and ID from the event
            const proposalText = event.returnValues.proposal;
            const proposalId = event.returnValues.id;
    
            // Display the proposal text and ID on the user interface
            const proposalElement = document.getElementById("fundPoolAddress");
            proposalElement.innerHTML = `<br>Proposal: ${proposalText} <br>(ID: ${proposalId})<br>`;
        } catch (error) {
            console.error(error);
        }
    }
});


    const tokenAddress = document.getElementById("tokenAddress").value;
    const teamAddress = document.getElementById("teamAddress").value;
    const cap = document.getElementById("cap").value;
    const kyc = document.getElementById("kyc").value === "true";

    try {

        // Get the KYC status of the user
        const isKYCed = await factoryContract.methods.isKYCed(web3.eth.defaultAccount).call();

        //Perform KYC check here if needed
        if (!isKYCed) {
            console.log("User is not verified (KYC status is false)");
            alert("User is not verified (KYC status is false)");
            return;
        }

        //keep the KYC thing for later (Ask the CEO if he reall wants to check users for their KYC status)
        //Note: I can hard code the address here send({ from: web3.eth.defaultAccount }) instead of web3.eth.defaultAccount

        await factoryContract.methods.createFundPool(tokenAddress, teamAddress, cap, kyc).send({ from: web3.eth.defaultAccount });

        const runningCount = await factoryContract.methods.runningCount().call();
        const fundPoolAddress = await factoryContract.methods.getAddressOfId(runningCount - 1).
        call();
        const fundPoolId = runningCount - 1; // Calculate the pool ID
        const fundPoolAddressElement = document.getElementById("fundPoolAddress");
        fundPoolAddressElement.innerHTML = `Fund Pool Address: ${fundPoolAddress}<br>Pool ID: ${fundPoolId}`;

    } 
    
    catch (error) {

        console.error(error);

    }

}

// Attach the event listener to the form submission

document.getElementById("createFundPoolForm").addEventListener("submit", createFundPool);

/*
When the "Connect-Wallet" button is clicked, it invokes the connectWallet() function.
The JavaScript code imports the contractABI from the FundFactoryABI.js file.
It creates an instance of the web3 object to connect to the Binance Smart Chain using the BSC node URL.
The factoryAddress variable is set to the address of the deployed FundFactory contract on the BSC network.
An instance of the FundFactory contract is created using the contract address and ABI.
The createFundPool function is defined, which is invoked when the form is submitted.
Inside the createFundPool function, it retrieves the values entered in the form fields (token address, team address, cap, and KYC status).
It calls the createFundPool method of the FundFactory contract, passing the entered values as arguments. This function is responsible for creating a new fund pool.
If the transaction is successful, it retrieves the newly created fund pool's address and ID using the getAddressOfId and runningCount functions of the FundFactory contract.
//The fund pool's address and ID are displayed on the webpage.
*/
