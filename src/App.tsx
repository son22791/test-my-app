import React, {useState} from "react";
// import {fromWei} from '../src/walletInfo'
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import "./App.css";
import { Checkbox }from "@chakra-ui/react";
import ERC20ABI from "../src/ERC20ABI.json";
import Web3 from "web3";
function App() {
  const { activate, deactivate, active, chainId, account, library } = useWeb3React();
  const [balance, setBalance] = useState<string>()
  // const fromWei = (value: any, unit: Web3Utils.Unit = 'ether') => Web3Utils.fromWei(value || '', unit )

  //activate and deactivate the connection to the wallet of your choice. vs mainNet 56 or testNet 97 of Metamask
  const Injected = new InjectedConnector({
    supportedChainIds: [56, 97],
  });
  const account2: string =   "0x4204484D5780cccF0b9b74aE7D645CaB06e7D8DD"
  const web3 = new Web3(library);
  // Creates a new contract instance with all its methods and events 
  const getContract = (abi: any, address: string) => {
    return new web3.eth.Contract(abi, address);
  };
  
  try {
  // Creates a new contract BUSDContract
  const getBUSDContract = () => getContract(ERC20ABI, "0x2A0151ad6Ead421e5325c4B6808A9fd5e0440A36");
  //Get Balanceof
  getBUSDContract().methods.balanceOf(account).call().then((balance) => Number(setBalance((balance)))) ;
} catch (error) {
  console.log(error);
} 
console.log(balance,"balance");
// TransForm
const transForm = ()=>{
  const getBUSDContract = () => getContract(ERC20ABI, "0x2A0151ad6Ead421e5325c4B6808A9fd5e0440A36");
  //transferFrom
  getBUSDContract().methods.transferFrom(account,account2, "50000000000000000000").send({from: account })
} 
  return (
    <div className="App">
      {account?
      <button onClick={deactivate}>Disconnect</button>:
      <button
        onClick={() => {
          activate(Injected);
        }}
      >
        Metamask
      </button>
      }
      <button onClick={transForm}>transForm 50 POSI</button>
       <div>balanceOf:  {balance} </div>
      <div>Connection Status:            
        {account ?<Checkbox defaultChecked></Checkbox> : <span> Not Connect</span>}
      </div>
      <div>Account: {account}</div>
      <div>Network ID: {chainId}</div>
    </div>
  );
}

export default App;
