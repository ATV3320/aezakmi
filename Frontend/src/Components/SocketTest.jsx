import React from 'react'
import { callMethods, main } from './main'
import { AscroAbi, AscroAddress, TestContractAbi, TestContractAddress } from '../Constants/Constants'

const SocketTest = () => {
  callMethods("0d2a1555a6429803d613692d3ea0d271e0a0bf972368a018da1b21930fa5af43",TestContractAddress,TestContractAbi,"change")
  return (
    <div>SocketTest</div>
  )
}

export default SocketTest