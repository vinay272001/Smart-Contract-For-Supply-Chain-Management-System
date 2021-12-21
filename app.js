const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/a0efa42f980a4f86a7b520728822238c')
// const web3 = new Web3('http://127.0.0.1:7545')

const account1 = '0xEa4b2462Ca60D64f8238037C471C584f49AdeEE5'
const account2 = '0x7CA2213CC978130f4fc42D95bD0061e806D33CE5'

const privateKey1 = process.env.PRIVATE_KEY_1
const privateKey2 = process.env.PRIVATE_KEY_2
const privateKey3 = '81efe037e8e22525cbee049aac5a8e5c7a7b5f31df52a4ee08be3c57324ef3b2'

const contractAddress = '0xF5f8bD49F7DE8e89F987Df03ED288B5f27e5acF3'
const contractABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "addProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "or_id", "type": "uint256" }], "name": "delivery", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "productId", "type": "uint256[]" }], "name": "orderProducts", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "showOrders", "outputs": [{ "components": [{ "internalType": "uint256", "name": "orderNum", "type": "uint256" }, { "internalType": "uint256", "name": "goodsPrice", "type": "uint256" }, { "internalType": "address", "name": "buyerAddress", "type": "address" }, { "internalType": "enum SupplyChain.OrderStatus", "name": "status", "type": "uint8" }], "internalType": "struct SupplyChain.Order[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "showProducts", "outputs": [{ "components": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "productId", "type": "uint256" }], "internalType": "struct SupplyChain.Product[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }]

async function getBalance(address) {
    await web3.eth.getBalance(address, (err, bal) => {
        balance = bal;
        console.log(web3.utils.fromWei(bal, 'ether'))
    })
}

async function signAndBrodcastTransaction(txObject, privateKey) {
    const signedTransaction = web3.eth.accounts.signTransaction(txObject, privateKey);

    var cAddress
    // Broadcasting Transaction
    await signedTransaction.then(signedTx => {
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction)

        sentTx.on("receipt", reciept => {
            console.log("reciept:", reciept)
        })

        sentTx.on("error", err => {
            console.log("Error : ", err)
        })
    })
}

async function addProduct(appContract, name, price) {
    if (price >= 0) {
        const txObject = {
            to : contractAddress,
            gas: '2100000',
            gasPrice: web3.utils.toWei('10', 'gwei'),
            data: appContract.methods.addProduct(name, price).encodeABI()
        }

        signAndBrodcastTransaction(txObject, privateKey1)
    }
}

async function showProducts() {
    appContract.methods.showProducts().call((err, result) => {
        console.log(result)
    })
}
var appContract = new web3.eth.Contract(contractABI, contractAddress)

nam = 'soap'
price = 150
// console.log(appContract)
// addProduct(appContract, nam, price)
showProducts()