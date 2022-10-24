import Web3Utils from 'web3-utils'


export const toWei = (value: any, unit: Web3Utils.Unit = 'ether') => Web3Utils.toWei(value, unit )
export const fromWei = (value: any, unit: Web3Utils.Unit = 'ether') => Web3Utils.fromWei(value || '', unit )
