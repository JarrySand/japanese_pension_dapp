const contractAddress = "0x9B466cebDDAE4cA06812695Cac4EE157C8755EbB";
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyWithDiscount",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "discountPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "price",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

window.addEventListener('load', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.log(error);
    }
    window.web3 = new Web3(window.ethereum)
  } else if (typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    console.log('No MetaMask detected')
  }
})

async function buy() {
  const amount = document.getElementById("normal-amount").value;
  const weiAmount = web3.utils.toWei(amount, "ether");
  const contract = new web3.eth.Contract(abi, contractAddress);
  const price = await contract.methods.price().call();
  const totalWeiAmount = web3.utils.toBN(weiAmount).mul(web3.utils.toBN(price));
  await contract.methods.buy().send({ value: totalWeiAmount.toString() });
}

async function buyWithDiscount() {
  const amount = document.getElementById("discount-amount").value;
  const weiAmount = web3.utils.toWei(amount, "ether");
  const contract = new web3.eth.Contract(abi, contractAddress);
  const discountPrice = await contract.methods.discountPrice().call();
  const price = await contract.methods.price().call();
  const discount = web3.utils.toBN(price).sub(web3.utils.toBN(discountPrice));
  const discountedWeiAmount = web3.utils.toBN(weiAmount).sub(discount);
  await contract.methods.buyWithDiscount().send({ value: discountedWeiAmount.toString() });
}
