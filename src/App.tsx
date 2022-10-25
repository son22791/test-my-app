import React, {useEffect, useState} from "react";
// import {fromWei} from '../src/walletInfo'
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import "./App.css";
import { Checkbox,FormControl, FormLabel, Input, FormErrorMessage, Button, Box }from "@chakra-ui/react";
import ERC20ABI from "../src/ERC20ABI.json";
import Web3 from "web3";
import Bonds from "./Bonds";
class BondInformation {
  constructor(
    public bondName: string,
    public bondSymbol: string,
    public description: string,
    public totalSupply: string,
    public startSale: number,
    public active: number,
    public duration: number,
    public issuePrice: string,
    ) { }
  }
  function App() {
    const { activate, deactivate, active, chainId, account, library } = useWeb3React();
    const [value, setValue] = useState('')
  const [balance, setBalance] = useState<string>()
  // const fromWei = (value: any, unit: Web3Utils.Unit = 'ether') => Web3Utils.fromWei(value || '', unit )


  useEffect(() => {
    setBalance(undefined)
  },[account]);
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
// TransForm
const transForm = ()=>{
  const getBUSDContract = () => getContract(ERC20ABI, "0x2A0151ad6Ead421e5325c4B6808A9fd5e0440A36");
  //transferFrom
  getBUSDContract().methods.transferFrom(account,account2, "50000000000000000000").send({from: account })
} 

//Bonds

// const {
//   bondName,
//   bondSymbol,
//   collateralAmount,
//   description,
//   faceValue,
//   duration,
//   durationUnit,
//   units,
//   issuePrice,
//   collateralType,
//   timeOnSale,
//   timeActive,
//   borrowSymbol,
// } = formData;

// const bondInformation = new BondInformation(
//   bondName.trim(),
//   bondSymbol.trim().toUpperCase(),
//   description.trim(),
//   new BigNumber(units).times(new BigNumber(10).pow(18)).toFixed(),
//   moment(timeOnSale).unix(),
//   moment(timeActive).unix(),
//   getDays(duration, durationUnit, timeActive),
//   new BigNumber(issuePrice).times(new BigNumber(10).pow(18)).toFixed(),
// );

const handleChange = (event) => setValue(event.target.value)
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
      <br />
      <br />
      <br />
      <Bonds/>
    </div>
  );
}

export default App;
