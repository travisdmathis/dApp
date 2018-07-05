import truffleContract from 'truffle-contract';

/**
 * This is a simple wrapper around truffle-contract
 * to be used to initialize ContractAbi.
 *
 * See containers/Deploy.js for how it is used.
 */

/**
 * Default contract constructor function.
 * This should be passed to CreateInitializer as a default implementation.
 * Uses truffle-contract create needed contract objects and set providers
 *
 */
export function contractConstructor(web3, contract) {
  const contractObj = truffleContract(contract);
  if (web3 != null && web3.currentProvider != null) {
    contractObj.setProvider(web3.currentProvider);
  }
  return contractObj;
}

/**
 * Create initializer
 *
 * @param {*} contractConstructor function to initialize a contract object from its ABI
 * @returns {(*) => ({*})} initializer function accepting contracts
 */
export default function CreateInitializer(contractConstructor) {
  if (typeof contractConstructor === 'undefined') {
    throw new Error(
      'contractConstructor is required to created contract initializer'
    );
  }

  if (typeof contractConstructor !== 'function') {
    throw new Error('contractConstructor must be a function');
  }

  // contracts is an object of each of contracts to be initialized
  return function(contracts) {
    const contractObjs = {};
    for (let contract in contracts) {
      if (
        contract.MARKET_COLLATERAL_POOL_ADDRESS !==
        '0x0000000000000000000000000000000000000000'
      ) {
        contractObjs[contract] = contractConstructor(contracts[contract]);
      }
    }
    return contractObjs;
  };
}
