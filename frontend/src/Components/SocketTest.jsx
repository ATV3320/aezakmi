import React from 'react'
import { book, bookride, callContractsMethods, callMethods, callMethodsInr, main } from './main'
import { AscroAbi, AscroAddress, InrAbi, InrAddress, TestContractAbi, TestContractAddress } from '../Constants/Constants'

const SocketTest = () => {
  //callMethods("0d2a1555a6429803d613692d3ea0d271e0a0bf972368a018da1b21930fa5af43",TestContractAddress,TestContractAbi,"change")
  //callMethodsInr("0d2a1555a6429803d613692d3ea0d271e0a0bf972368a018da1b21930fa5af43",TestContractAddress,TestContractAbi,"change")
 // bookride("0d2a1555a6429803d613692d3ea0d271e0a0bf972368a018da1b21930fa5af43",TestContractAddress,TestContractAbi,"change")
 callContractsMethods("0d2a1555a6429803d613692d3ea0d271e0a0bf972368a018da1b21930fa5af43",InrAddress,InrAbi,"approve", [AscroAddress, 10000])
  return (
    <div>SocketTest</div>
  )
}

export default SocketTest