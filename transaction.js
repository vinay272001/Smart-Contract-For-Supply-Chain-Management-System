const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/a0efa42f980a4f86a7b520728822238c')
var Tx = require('ethereumjs-tx')

const account1 = '0xEa4b2462Ca60D64f8238037C471C584f49AdeEE5'
const account2 = '0x6e81D9e2f2283227a4b6C5F015bDfdc507E331AE'

const privateKey1 = process.env.PRIVATE_KEY_1
const privateKey2 = process.env.PRIVATE_KEY_2

async function getBalance(address) {
    await web3.eth.getBalance(address, (err, bal) => {
        balance = bal;
        console.log(web3.utils.fromWei(bal, 'ether'))
    })
}

getBalance(account1)
getBalance(account2)

// Building Transaction
const txObject = {
    to: account2,
    value: web3.utils.toWei('0.1', 'ether'),
    gas: '21000',
    gasPrice: web3.utils.toWei('10', 'gwei')
    }

// Signing Transaction
const signedTransaction = web3.eth.accounts.signTransaction(txObject, privateKey1);

// Broadcasting Transaction
signedTransaction.then(signedTx => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction)

    sentTx.on("receipt", reciept => {
        console.log("reciept:", reciept)
    })

    sentTx.on("error", err => {
        console.log("Error : ", err)
    })
})

// web3.eth.sendSignedTransaction(raw, (err, TxHash) => {
//     console.log('txhash:', TxHash)
// })

