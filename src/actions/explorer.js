/**
 * loads list of Market Contracts based on whitelisted addresses in MarketContractRegistry
 *
 * `processContracts` is a function to fetch and process the loaded contract address to any format required.
 *
 */
export function loadContracts(
  { web3, processContracts },
  { MarketContractRegistry, CollateralToken }
) {
  const type = 'GET_CONTRACTS';

  return function(dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({ type: `${type}_PENDING` });

      // Double-check web3's status
      if (web3 && typeof web3 !== 'undefined') {
        // Declaring this for later so we can chain functions.
        let marketContractRegistryInstance;

        MarketContractRegistry.deployed().then(function(instance) {
          marketContractRegistryInstance = instance;
          // Attempt to find deployed contracts and get metadata
          marketContractRegistryInstance.getAddressWhiteList
            .call()
            .then(async function(deployedContracts) {
              await CollateralToken.deployed();
              processContracts(deployedContracts).then(function(data) {
                dispatch({ type: `${type}_FULFILLED`, payload: data });
                resolve(data);
              });
            });
        });
      } else {
        dispatch({
          type: `${type}_REJECTED`,
          payload: { error: 'Web3 not initialised' }
        });
        reject({ error: 'Web3 not initialised' });
      }
    });
  };
}
